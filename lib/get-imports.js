/* eslint-env node */

const j = require('jscodeshift');
const fs = require('fs');
const stripBom = require('strip-bom');
const path = require('path');

const { writeToFile, getAllFileNames, getIntersectionByFileName } = require('./utils');
const { getDefineStatementMatcher, getUseStrictStatementMatcher  } = require('./utils/ast-matcher');
const plugins = require('./plugins');
const getRoutingInfo = require('./utils/get-routing-info')
const getHelpers = require('./utils/helpers');
const resolveDepedents = require('./utils/resolve-dependents');

const defineStatementMatcher = getDefineStatementMatcher();
const useStrictStatementMatcher = getUseStrictStatementMatcher();

module.exports = class GetImports {

  constructor({ projectRoot, projectNameSpace, inputFilePath, bundles }) {
    this.externalModules = new Set();
    this.projectRoot = projectRoot;
    this.projectNameSpace = projectNameSpace;
    this.inputFilePath = path.join(projectRoot, inputFilePath);
    this.buildOutputPath = `${this.projectRoot}/build/src/`;
    this.bundles = bundles;
    this.loadPlugins();
  }

  loadPlugins() {
    this.plugins = Object.keys(plugins).map(name => ({ name, plugin: plugins[name] }));
  }

  runPlugins({ nodePath, projectRoot, projectNameSpace, fileName, util }) {
    let _imports = [];
    let imports = [];
    let externals = new Set();
    let rootNameSpace = `${projectNameSpace}/`;

    this.plugins.forEach((row) => {
      imports = row.plugin({
        imports,
        nodePath,
        projectRoot,
        projectNameSpace,
        fileName,
        util
      });
    });

    imports.forEach((importPath) => {
      if (importPath.startsWith(rootNameSpace)) {
        _imports.push(importPath);
      } else {
        externals.add(importPath.split('/')[0]);
      }
    });

    return {
      imports: _imports,
      externals
    }
  }

  generateImports({ ast, allFiles, util }) {
    let projectRoot = this.projectRoot;
    let projectNameSpace = this.projectNameSpace;
    let additionalFiles = [];

    ast.paths()[0].getValueProperty('program').body.forEach((node) => {
      if (j.match(node, defineStatementMatcher)) {
        let nodePath = j(node.expression).paths()[0];
        let [fileNode] = nodePath.getValueProperty('arguments');
        let fileName = fileNode.value;
        let fileInstance = util.findFile(fileName);

        let {
          imports,
          externals
        } = this.runPlugins({
          nodePath,
          allFiles,
          projectRoot,
          projectNameSpace,
          fileName,
          util
        });

        this.externalModules.add(...externals);

        Object.assign(fileInstance, {
          imports,
          content: j(nodePath).toSource()
        });
      } else if (!j.match(node, useStrictStatementMatcher)) {
        additionalFiles.push({
          originalPath: `additional-file-${additionalFiles.length + 1}`,
          content: j(node).toSource()
        });
      }
    });

    return {
      allFiles,
      additionalFiles
    }
  }

  writeToDir(files) {

    let buildOutputPath = this.buildOutputPath;

    files.forEach((row) => {
      let filePath = `${buildOutputPath}/${row.originalPath}.js`;

      writeToFile({
        filePath,
        content: row.content
      });

      let stats = fs.statSync(filePath);
      row.size = stats.size;

      delete row.content;
    });
  }

  getEntryPointsForBundle({ mainEntryFile }) {
    let projectNameSpace = this.projectNameSpace;
    let bundles = this.bundles;
    const bundlesConfig = {};

    bundles.forEach((bundleName) => {
      let entryFiles = [];
      let templatePath = `${projectNameSpace}/templates/${bundleName}`;
      let controllerPath = `${projectNameSpace}/controllers/${bundleName}`;
      let routePath = `${projectNameSpace}/routes/${bundleName}`;

      mainEntryFile = mainEntryFile.filter((file) => {
        if (
          file.startsWith(templatePath) ||
          file.startsWith(controllerPath) ||
          file.startsWith(routePath)
        ) {
          entryFiles.push(file)
          return false;
        }
        return true;
      });

      bundlesConfig[bundleName] = {
        entryFiles
      }
    });

    bundlesConfig['main'] = {
      entryFiles: mainEntryFile
    };

    return bundlesConfig;
  }

  getRoutesHash() {
    let routerContent = fs.readFileSync(`${this.buildOutputPath}/zb/router.js`, { encoding: 'utf8' });
    return getRoutingInfo(j(routerContent));
  }

  generateMainEntryFile({ routesHash, util }) {
    let projectNameSpace = this.projectNameSpace;
    let mainEntryFiles = [];

    routesHash.forEach((row) => {
      let routeName = row.replace(/\./g, '/');
      let normalizedValue = `${projectNameSpace}/routes/${routeName}`;
      let routeFile = util.resolveFilePath(normalizedValue);

      if (routeFile) {
        mainEntryFiles.push(routeFile);
      } else {
        // Incase, if the route doesn't exists we need to push the associated controller and template to entry points. Else it won't be bundled.
        let controllerFile = util.resolveFilePath(normalizedValue.replace('/routes/', '/controllers/'));
        let templateFile = util.resolveFilePath(normalizedValue.replace('/routes/', '/templates/'));

        if (controllerFile) {
          mainEntryFiles.push(controllerFile)
        }

        if (templateFile) {
          mainEntryFiles.push(templateFile);
        }
      }
    });
    return mainEntryFiles;
  }

  resolveDepedents({ bundles, util }) {
    Object.keys(bundles).forEach((bundleName) => {
      let bundle = bundles[bundleName];
      bundle.dependents = resolveDepedents({ bundle, util });
    });
    return bundles;
  }

  generateCommonChunks({ bundles }) {
    let mainBundle = bundles.main;
    let mainBundleDependents = mainBundle.dependents;
    let additionalBundles = Object.keys(bundles)
    .filter((bundle) => bundle !== 'main')
    .map((name) => ({ name, dependents: bundles[name].dependents }));

    let intersection = getIntersectionByFileName([mainBundleDependents, ...additionalBundles.map(row => row.dependents)]);

    additionalBundles.forEach((bundle) => {
      let { dependents } = bundle;

      bundle.dependents = dependents.filter((row) => {
        let { originalPath } = row;
        return !intersection.find(row => row.originalPath === originalPath)
      });
    });

    bundles['common'] = {
      commonTo: additionalBundles.map(row => row.name),
      dependents: intersection
    };
    return bundles
  }

  prepareOutputfiles(bundles) {
    Object.keys(bundles).forEach((name) => {
      let bundle = bundles[name];

      
    })
  }

  run() {
    let ast, fileContent, allFiles, additionalFiles, routesHash, util, mainEntryFile, bundles;

    fileContent = stripBom(fs.readFileSync(this.inputFilePath, { encoding: 'utf8' }));
    ast = j(fileContent);
    allFiles = getAllFileNames(ast);
    util = getHelpers(allFiles);
    ({ allFiles, additionalFiles } = this.generateImports({ allFiles, ast, util }));

    this.writeToDir([...allFiles, ...additionalFiles]);
    routesHash = this.getRoutesHash();

    mainEntryFile = this.generateMainEntryFile({ routesHash, util });
    bundles = this.getEntryPointsForBundle({ mainEntryFile });
    bundles = this.resolveDepedents({ bundles, util });

    bundles = this.generateCommonChunks({ bundles });

    this.prepareOutputfiles(bundles);

    console.log(allFiles, additionalFiles, routesHash, mainEntryFile, bundles.common);

  }

  getExternalModules() {
    return [...this.externalModules].filter((row) => !!row);
  }
}

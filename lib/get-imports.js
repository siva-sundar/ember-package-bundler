/* eslint-env node */

const j = require('jscodeshift');
const fs = require('fs');
const stripBom = require('strip-bom');
const path = require('path');

const { writeToFile, getAllFileNames } = require('./utils');
const { getDefineStatementMatcher, getUseStrictStatementMatcher  } = require('./utils/ast-matcher');
const getExternals = require('./utils/get-externals');
const plugins = require('./plugins');
const getRoutingInfo = require('./utils/get-routing-info')
const getHelpers = require('./utils/helpers');
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

  runPlugins({ imports, nodePath, projectRoot, projectNameSpace, fileName, util }) {

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

    return imports;
  }

  generateImports() {
    let projectRoot = this.projectRoot;
    let projectNameSpace = this.projectNameSpace;
    let fileContent = stripBom(fs.readFileSync(this.inputFilePath, { encoding: 'utf8' }));
    let ast = j(fileContent)
    let allFiles = getAllFileNames(ast);
    let util = getHelpers(allFiles);
    let additionalFiles = [];

    ast.paths()[0].getValueProperty('program').body.forEach((node) => {

      if (j.match(node, defineStatementMatcher)) {
        let imports = [];
        let nodePath = j(node.expression).paths()[0];
        let [fileNode] = nodePath.getValueProperty('arguments');
        let fileName = fileNode.value;
        let fileInstance = util.findFile(fileName);

        this.runPlugins({ imports, nodePath, allFiles, projectRoot, projectNameSpace, fileName, util });

        this.externalModules.add(...getExternals({ nodePath, projectNameSpace }));

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

  writeToDir({ allFiles, additionalFiles}) {

    let buildOutputPath = this.buildOutputPath;

    allFiles.forEach((row) => {
      writeToFile({
        filePath: `${buildOutputPath}/${row.originalPath}.js`,
        content: row.content
      });
      delete row.content;
    });

    additionalFiles.forEach((row) => {
      writeToFile({
        filePath: `${buildOutputPath}/${row.originalPath}.js`,
        content: row.content
      });
      delete row.content;
    });
  }

  getEntryPointsForBundle(bundles = {}) {
    Object.keys(bundles).forEach((bundle) => {
      bundle
    });
  }

  getRoutesHash() {
    let routerContent = fs.readFileSync(`${this.buildOutputPath}/zb/router.js`, { encoding: 'utf8' });

    return getRoutingInfo(j(routerContent));
  }

  run() {
    let fileInfoHash;
    let routesHash;

    fileInfoHash = this.generateImports();
    this.writeToDir(fileInfoHash);

    routesHash = this.getRoutesHash();

    console.log(fileInfoHash, routesHash);

  }

  getExternalModules() {
    return [...this.externalModules].filter((row) => !!row);
  }
}

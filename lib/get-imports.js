/* eslint-env node */

const j = require('jscodeshift');
const fs = require('fs');
const stripBom = require('strip-bom');
const path = require('path');

const { writeToFile, getAllFileNames, findFileByName } = require('./utils');
const { getDefineStatementMatcher, getUseStrictStatementMatcher  } = require('./utils/ast-matcher');
const getExternals = require('./utils/get-externals');
const plugins = require('./plugins');

const defineStatementMatcher = getDefineStatementMatcher();
const useStrictStatementMatcher = getUseStrictStatementMatcher();

class getImports {

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

  runPlugins({ imports, nodePath, projectRoot, projectNameSpace, fileName }) {

    this.plugins.forEach((row) => {
      imports = row.plugin({
        imports,
        nodePath,
        projectRoot,
        projectNameSpace,
        fileName
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
    let additionalFiles = [];

    ast.paths()[0].getValueProperty('program').body.forEach((node) => {

      if (j.match(node, defineStatementMatcher)) {
        let imports = [];
        let nodePath = j(node.expression).paths()[0];
        let [fileNode] = nodePath.getValueProperty('arguments');
        let fileName = fileNode.value;
        let fileInstance = findFileByName(allFiles, fileName);

        this.runPlugins({ imports, nodePath, allFiles, projectRoot, projectNameSpace, fileName });

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
    
  }

  run() {
    let fileInfoHash;
    let routesHash;

    fileInfoHash = this.generateImports();
    this.writeToDir(fileInfoHash);

    routesHash = this.getRoutesHash();

    this.getEntryPointsForBundle(this.bundles);

  }

  getExternalModules() {
    return [...this.externalModules].filter((row) => !!row);
  }

}


module.exports = WebpackBuild;

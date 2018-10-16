/* eslint-env node */

const j = require('jscodeshift');
const fs = require('fs');
const stripBom = require('strip-bom');
const path = require('path');

const { writeToFile, getAllFileNames } = require('./utils');

const preProcessPlugins = require('./pre-process-plugins');
const getExternals = require('./utils/get-externals');
const plugins = require('./plugins');
const postProcessPlugins = require('./post-process-plugins');


class WebpackBuild {

  constructor({ projectRoot, projectNameSpace, inputFilePath }) {
    this.externalModules = new Set();
    this.projectRoot = projectRoot;
    this.projectNameSpace = projectNameSpace;
    this.inputFilePath = path.join(projectRoot, inputFilePath);
    this.loadPlugins();
  }

  _loadPlugins(plugins) {
    return Object.keys(plugins).map(name => ({ name, plugin: plugins[name] }));
  }

  loadPlugins() {
    this.preProcessPlugins = this._loadPlugins(preProcessPlugins);
    this.plugins = this._loadPlugins(plugins);
    this.postProcessPlugins = this._loadPlugins(postProcessPlugins);
  }

  runPlugins({ nodePath, allFiles, projectRoot, projectNameSpace, fileName }) {
    this.preProcessPlugins.forEach((row) => {
      nodePath = row.plugin({
        nodePath,
        allFiles,
        projectRoot,
        projectNameSpace,
        fileName
      });
    });

    this.plugins.forEach((row) => {
      nodePath = row.plugin({
        nodePath,
        allFiles,
        projectRoot,
        projectNameSpace,
        fileName
      });
    });

    this.postProcessPlugins.forEach((row) => {
      nodePath = row.plugin({
        nodePath,
        allFiles,
        projectRoot,
        projectNameSpace,
        fileName
      });
    });

    return nodePath;
  }

  run() {
    let projectRoot = this.projectRoot;
    let projectNameSpace = this.projectNameSpace;
    let fileContent = stripBom(fs.readFileSync(this.inputFilePath, { encoding: 'utf8' }));
    let ast = j(fileContent)
    let allFiles = getAllFileNames(ast);
    let moduleConfig = [];
    let buildOutputPath = `${this.projectRoot}/build/src/`;
    let additionalFiles = [];
    let nodes;
    const defineStatement = {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'define'
        }
      }
    };
    const useStrictStatement = {
      "type": "ExpressionStatement",
      "expression": {
        "type": "Literal",
        "value": "use strict"
      }
    };

    ast.paths()[0].getValueProperty('program').body.forEach((node) => {

      if (j.match(node, defineStatement)) {
        let nodePath = j(node.expression).paths()[0];
        let [fileNode] = nodePath.getValueProperty('arguments');
        let fileName = fileNode.value;
        let filePath = `${buildOutputPath}/${fileName}.js`;

        nodePath = this.runPlugins({ nodePath, allFiles, projectRoot, projectNameSpace, fileName });



        nodes = j(nodePath).nodes();
        nodePath = j.file(j.program(nodes));

        this.externalModules.add(...getExternals({ nodePath, projectNameSpace }));
        moduleConfig.push({
          filePath,
          content: j(nodePath).toSource()
        });
      } else if (!j.match(node, useStrictStatement)) {
        additionalFiles.push(node);
      }
    });

    moduleConfig.forEach((row) => {
      writeToFile(row);
    });

    let additionalFilesContent = j(j.file(j.program(j(additionalFiles).nodes()))).toSource()
    writeToFile({
      filePath: `${buildOutputPath}/additional-content.js`,
      content: additionalFilesContent
    })
  }

  getExternalModules() {
    return [...this.externalModules].filter((row) => !!row);
  }

}


module.exports = WebpackBuild;

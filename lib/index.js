/* eslint-env node */

const j = require('jscodeshift');
const fs = require('fs');
const stripBom = require('strip-bom');
const path = require('path');

const {
  processModuleByNameSpace,
  getAllModulesAndFiles
} = require('./transform-module-to-file');
const { writeToFile } = require('./utils');


module.exports = function({ projectRoot, projectNameSpace, filePath }) {
  filePath = path.join(projectRoot, filePath);

  let externalModules = new Set();
  let fileContent = stripBom(fs.readFileSync(filePath, { encoding: 'utf8' }));
  let { allFiles, modulesNodes } = getAllModulesAndFiles(j(fileContent));

  modulesNodes.forEach((nodePath) => {
    let { externals, rootProjectModule } = processModuleByNameSpace({
      nodePath,
      allFiles,
      projectRoot,
      outputPath: path.dirname(filePath),
      projectNameSpace
    });

    externalModules.add(...externals);
    writeToFile(rootProjectModule);
  });
};

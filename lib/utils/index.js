/* eslint-env node */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

function isRoute(fileName) {
  return fileName.includes('/routes/');
}

function isFileExists({ allFiles, fileName }) {
  return allFiles.includes(fileName);
}

function isController(fileName) {
  return fileName.includes('/controllers/');
}

function isComponentJS(fileName) {
  return fileName.includes('/components/') && !fileName.includes('/templates/components/');
}

function isComponentTemplate(fileName) {
  return fileName.includes('/templates/components/');
}

function isTemplate(fileName) {
  return fileName.includes('/templates/');
}

function writeToFile({ filePath, content }) {
  let dirName = path.dirname(path.resolve(filePath));
  mkdirp.sync(dirName);
  fs.writeFileSync(filePath, content);
}

module.exports = {
  isRoute,
  isController,
  isTemplate,
  isComponentJS,
  isFileExists,
  isComponentTemplate,
  writeToFile
}

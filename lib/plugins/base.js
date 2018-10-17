const decamelize = require('decamelize');

module.exports = class BasePlugin {

  constructor({ allFiles, nodePath, fileName, projectNameSpace }) {
    this.allFiles = allFiles;
    this.nodePath = nodePath;
    this.fileName = fileName;
    this.projectNameSpace = projectNameSpace;
  }

  resolveFilePath(fileName = '') {
    let normalizedPath = decamelize(fileName).toLowercase().replace(/\./, '/').replace(/_/g, '-');

    let file = this.allFiles.find((f) => f.normalizedPath === normalizedPath) || {};

    return file.originalPath;
  }

  isFileExists(fileName) {
    return this.resolveFilePath(fileName);
  }
}

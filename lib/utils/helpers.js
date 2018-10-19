const decamelize = require('decamelize');

module.exports = function helper(allFiles) {

  return {
    findFile(fileName) {
      return allFiles.find((file) => file.originalPath === fileName);
    },

    resolveFilePath(fileName = '') {
      let normalizedPath = decamelize(fileName).toLowerCase().replace(/\./, '/').replace(/_/g, '-');

      let file = allFiles.find((f) => f.normalizedPath === normalizedPath) || {};

      return file.originalPath;
    },

    isFileExists(fileName) {
      return this.resolveFilePath(fileName);
    }
  }
}

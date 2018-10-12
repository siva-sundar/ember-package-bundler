const j = require('jscodeshift');

module.exports = function getExternalImports({ nodePath, projectNameSpace }) {
  let importPath;
  let externals = new Set();
  j(nodePath).find(j.ImportDeclaration).forEach((importNodePath) => {
    importPath = importNodePath.getValueProperty('source').value;

    if (!importPath.startsWith(`${projectNameSpace}/`)) {
      externals.add(importPath.split('/')[0]);
    }
  });
  return [...externals];
}

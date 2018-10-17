const j = require('jscodeshift');

module.exports = function getExternalImports({ nodePath, projectNameSpace }) {
  let importPath;
  let externals = new Set();
  let [, importDepedencies] = nodePath.getValueProperty('arguments');

  importDepedencies.elements.forEach((importNodePath) => {
    importPath = importNodePath.value;

    if (!importPath.startsWith(`${projectNameSpace}/`)) {
      externals.add(importPath.split('/')[0]);
    }
  });

  return [...externals];
}

/* eslint-env node */

module.exports = function getExternalImports({ imports, nodePath }) {
  let importNodePath;
  let [, { elements }] = nodePath.getValueProperty('arguments');

  for (let i = 1; i < elements.length; i++ ) {
    importNodePath = elements[i];
    imports.push(importNodePath.value);
  }

  return imports;
}

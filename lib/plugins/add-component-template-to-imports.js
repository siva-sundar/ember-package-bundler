const j = require('jscodeshift');

const { getLayoutNameMatcher } = require('../utils/ast-matcher');
const {
  constructImportDeclaration,
  isFileExists,
  isComponentJS
} = require('../utils');

module.exports = function addComponentTemplateToImports({ nodePath, fileName, allFiles, projectNameSpace }) {

  if (!isComponentJS(fileName)) {
    return nodePath
  }

  let layoutNameProperty = j(nodePath).find(j.Property, getLayoutNameMatcher()).find(j.Literal);
  if (layoutNameProperty.length) {
    let templatePath = layoutNameProperty.get('value').value;
    nodePath.unshift(constructImportDeclaration({ importPath: `${projectNameSpace}/templates/components/${templatePath}` }));
  } else {
    let templatePath = fileName.replace('/components/', '/templates/components/');
    if (isFileExists({ allFiles, fileName: templatePath })) {
      nodePath.unshift(constructImportDeclaration({ importPath: templatePath }));
    }
  }
  return nodePath;
}

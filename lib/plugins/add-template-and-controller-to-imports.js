/* eslint-env node */
const j = require('jscodeshift');
const {
  getTemplateNameMather,
  getControllerNameMather
} = require('../utils/ast-matcher');

const {
  constructImportDeclaration,
  isFileExists,
  isRoute
} = require('../utils');

module.exports = function addTemplateAndControllerToImports({ nodePath, fileName, allFiles, projectNameSpace }) {

  if (!isRoute(fileName)) {
    return nodePath;
  }

  let templateNameProperty = j(nodePath).find(j.Property, getTemplateNameMather()).find(j.Literal);
  if (templateNameProperty.length) {
    let templatePath = templateNameProperty.get('value').value;
    nodePath.unshift(constructImportDeclaration({
      importPath: `${projectNameSpace}/templates/${templatePath}`
    }));
  } else {
    let templatePath = fileName.replace('/routes/', '/templates/');
    if (isFileExists({ allFiles, fileName: templatePath })) {
      nodePath.unshift(constructImportDeclaration({ importPath: templatePath }));
    }
  }

  let controllerPath;
  let controllerNameProperty = j(nodePath).find(j.Property, getControllerNameMather()).find(j.Literal);

  if (controllerNameProperty.length) {
    controllerPath = controllerNameProperty.get('value').value;
    nodePath.unshift(constructImportDeclaration({ importPath: `${projectNameSpace}/controllers/${controllerPath}` }));
  } else {
    controllerPath = fileName.replace('/routes/', '/controllers/');
    if (isFileExists({ allFiles, fileName: controllerPath })) {
      nodePath.unshift(constructImportDeclaration({ importPath: controllerPath }));
    }
  }
  return nodePath;
}

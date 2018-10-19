/* eslint-env node */
const j = require('jscodeshift');
const {
  getTemplateNameMather,
  getControllerNameMather
} = require('../utils/ast-matcher');

const {
  isRoute
} = require('../utils');

module.exports = function addTemplateAndControllerToImports({ nodePath, imports, fileName, projectNameSpace, util }) {

  if (!isRoute(fileName)) {
    return imports;
  }

  let templateNameProperty = j(nodePath).find(j.Property, getTemplateNameMather()).find(j.Literal);

  if (templateNameProperty.length) {
    let templatePath = templateNameProperty.get('value').value;
    let templateFile = util.resolveFilePath(`${projectNameSpace}/templates/${templatePath}`);

    if (templateFile) {
      imports.push(templateFile);
    }
  } else {
    let templateFile = util.resolveFilePath(fileName.replace('/routes/', '/templates/'));

    if (templateFile) {
      imports.push(templateFile);
    }
  }

  let controllerNameProperty = j(nodePath).find(j.Property, getControllerNameMather()).find(j.Literal);

  if (controllerNameProperty.length) {
    let controllerPath = controllerNameProperty.get('value').value;
    let controllerFile = util.resolveFilePath(`${projectNameSpace}/controllers/${controllerPath}`);

    if (controllerFile) {
      imports.push(controllerFile);
    }

  } else {
    let controllerPath = fileName.replace('/routes/', '/controllers/');
    let controllerFile = util.resolveFilePath(controllerPath);

    if (controllerFile) {
      imports.push(controllerFile);
    }
  }

  return imports;
}

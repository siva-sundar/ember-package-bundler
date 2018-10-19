/* eslint-env node */
const j = require('jscodeshift');

const { getInjectControllerMathcer } = require('../utils/ast-matcher');
const {
  isController,
  isRoute
} = require('../utils');

module.exports = function addInjectControllerToImports({ nodePath, imports, projectNameSpace, fileName, util }) {

  if (!(isRoute(fileName) || isController(fileName))) {
    return imports;
  }

  let injectControllerProperty = j(nodePath).find(j.Property, getInjectControllerMathcer());

  if (injectControllerProperty.length) {
    let injectController = injectControllerProperty.find(j.CallExpression);
    let name;
    let args = injectController.get('arguments').value;

    if (args.length) {
      name = args[0].value;
    } else {
      name = injectControllerProperty.get('key').getValueProperty('name');
    }

    let controllerFile = util.resolveFilePath(`${projectNameSpace}/controllers/${name}`);

    if (controllerFile) {
      imports.push(controllerFile);
    }
  }

  return imports;
}

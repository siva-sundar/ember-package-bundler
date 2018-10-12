/* eslint-env node */
const j = require('jscodeshift');

const { getInjectControllerMathcer } = require('../utils/ast-matcher');
const {
  constructImportDeclaration,
  isController,
  isRoute
} = require('../utils');

module.exports = function addInjectControllerToImports({ nodePath, projectNameSpace, fileName }) {

  if (!(isRoute(fileName) || isController(fileName))) {
    return nodePath;
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
    nodePath.unshift(constructImportDeclaration({ importPath: `${projectNameSpace}/controllers/${name}` } ));
  }
  return nodePath;
}

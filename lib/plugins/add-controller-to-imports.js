const j = require('jscodeshift');

const { getControllerForMatcher } = require('../utils/ast-matcher');
const {
  constructImportDeclaration,
  isRoute,
  isController
} = require('../utils');

module.exports = function addControllerForToImports({ nodePath, projectNameSpace, fileName }) {

  if (!(isRoute(fileName) || isController(fileName))) {
    return nodePath
  }
  let controllerForPaths = j(nodePath).find(j.CallExpression, getControllerForMatcher());

  controllerForPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value[0];
    if (args && args.type === 'Literal') {
      let controllerPath = args.value;
      nodePath.unshift(constructImportDeclaration({ importPath: `${projectNameSpace}/controllers/${controllerPath}` }));
    } else {
      console.log('controller path is dynamic or not passed', j(currentPath).toSource()); // eslint-disable-line no-console
    }
  });
  return nodePath;
}

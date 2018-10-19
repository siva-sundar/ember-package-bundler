const j = require('jscodeshift');

const { getControllerForMatcher } = require('../utils/ast-matcher');
const {
  isRoute,
  isController
} = require('../utils');

module.exports = function addControllerForToImports({ nodePath, imports, util, projectNameSpace, fileName }) {

  if (!(isRoute(fileName) || isController(fileName))) {
    return imports;
  }

  let controllerForPaths = j(nodePath).find(j.CallExpression, getControllerForMatcher());

  controllerForPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value[0];

    if (args && args.type === 'Literal') {
      let controllerPath = args.value;
      let controllerFile = util.resolveFilePath(`${projectNameSpace}/controllers/${controllerPath}`);

      if (controllerFile) {
        imports.push(controllerFile);
      }
    } else {
      console.log('controller path is dynamic or not passed', j(currentPath).toSource()); // eslint-disable-line no-console
    }

  });

  return imports;
}

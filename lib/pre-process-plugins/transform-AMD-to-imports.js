const j = require('jscodeshift');
const {
  getDefaultIdentifierMatcher
} = require('../utils/ast-matcher');

const { constructImportDeclaration } = require('../utils');

function stripDefaultReferences({ nodePath, importVariable }) {
  let defaultIndentifier = j(nodePath).find(j.MemberExpression, getDefaultIdentifierMatcher(importVariable));

  defaultIndentifier.replaceWith(j.identifier(importVariable));
  return nodePath;
}

module.exports = function transformAMDToImportsAndGetExternals ({ nodePath }) {
  let importVariableNode;
  let importPathNode;
  let importPathValue;
  let importVariableName;
  let args = nodePath.get('arguments');
  let imports = [];
  let { value: importPaths } = args.get('1').get('elements');
  let exportFunction = args.get('2');
  let { value: importVariables } = exportFunction.get('params');

  for (let i = 1; i < importPaths.length; i++) {
    importVariableNode = importVariables[i];
    importPathNode = importPaths[i];
    importPathValue = importPathNode.value;

    if (importVariableNode) {
      importVariableName = importVariableNode.name;
      nodePath = stripDefaultReferences({ nodePath, importVariable: importVariableNode.name });
    } else {
      importVariableName = undefined;
    }

    let node = constructImportDeclaration({
      importVariable: importVariableName,
      importPath: importPathValue
    });
    imports.push(node);

  }
  let exportFunctionPath = j(exportFunction.get('body').getValueProperty('body')).paths();

  return [...imports, ...exportFunctionPath];
}

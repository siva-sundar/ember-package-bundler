/* eslint-env node */
const j = require('jscodeshift');

const { getRenderMatcher } = require('../utils/ast-matcher');
const {
  constructImportDeclaration,
  isRoute
} = require('../utils');

module.exports = function addRenderToImports ({ nodePath, projectNameSpace, fileName }) {

  if (!isRoute(fileName)) {
    return nodePath;
  }

  let renderPaths = j(nodePath).find(j.CallExpression, getRenderMatcher());
  renderPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value;
    args.forEach((arg) => {
      if (arg.type === 'Literal') {
        nodePath.unshift(constructImportDeclaration({ importPath: `${projectNameSpace}/templates/${arg.value}` }));
      } else if (arg.type === 'ObjectExpression') {
        let controllerPath = j(arg).find(j.Property, {
          key: {
            name: 'controller'
          }
        }).paths()[0];
        // no need to consider controller value other than a Literal, for instance this.render('apple', { controller: this });
        if (controllerPath && controllerPath.getValueProperty('value').type === 'Literal') {
          nodePath.unshift(constructImportDeclaration({
            importPath: `${projectNameSpace}/controllers/${controllerPath.getValueProperty('value').value}`
          }));
        }
      }
    })
  });
  return nodePath;
}

/* eslint-env node */
const j = require('jscodeshift');

const { getRenderMatcher } = require('../utils/ast-matcher');
const {
  isRoute
} = require('../utils');

module.exports = function addRenderToImports ({ imports, nodePath, projectNameSpace, fileName, util }) {

  if (!isRoute(fileName)) {
    return imports;
  }

  let renderPaths = j(nodePath).find(j.CallExpression, getRenderMatcher());

  renderPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value;

    args.forEach((arg) => {
      if (arg.type === 'Literal') {
        let templateFile = util.resolveFilePath(`${projectNameSpace}/templates/${arg.value}`);

        if (templateFile) {
          imports.push(templateFile)
        }
      } else if (arg.type === 'ObjectExpression') {
        let controllerPath = j(arg).find(j.Property, {
          key: {
            name: 'controller'
          }
        }).paths()[0];

        // no need to consider controller value other than a Literal, for instance this.render('apple', { controller: this });
        if (controllerPath && controllerPath.getValueProperty('value').type === 'Literal') {
          let controllerName = controllerPath.getValueProperty('value').value;
          let controllerFile = util.resolveFilePath(`${projectNameSpace}/controllers/${controllerName}`);

          if (controllerFile) {
            imports.push(controllerFile);
          }
        }
      }
    })
  });
  return imports;
}

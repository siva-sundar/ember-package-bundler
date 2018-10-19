/* eslint-env node */
const j = require('jscodeshift');

const { getShowModalMatcher } = require('../utils/ast-matcher');
const {
  isRoute,
  isController,
  isComponentJS
} = require('../utils');

module.exports = function addShowModalToImports({ nodePath, imports, projectNameSpace, fileName, util }) {

  if (!(isRoute(fileName) || isController(fileName) || isComponentJS(fileName))) {
    return imports
  }
  let showModalPaths = j(nodePath).find(j.CallExpression, getShowModalMatcher());

  showModalPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value;
    if (args.length > 1) {
      let templatePath = args[1];
      if (templatePath.type === 'Literal') {
        let templateName = templatePath.value;
        let templateFile = util.resolveFilePath(`${projectNameSpace}/templates/${templateName}`);

        if (templateFile) {
          imports.push(templateFile);
        }

        let associatedControllerFile = util.resolveFilePath(`${projectNameSpace}/controllers/${templateName}`);

        if (!args[2] && associatedControllerFile) { // controller instance is not passed.
          imports.push(associatedControllerFile);
        }
      } else {
        console.log(`----> manual import required ${j(currentPath).toSource()}`); // eslint-disable-line
      }
    }
  });

  return imports;
}

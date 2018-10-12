/* eslint-env node */
const j = require('jscodeshift');

const { getShowModalMatcher } = require('../utils/ast-matcher');
const {
  constructImportDeclaration,
  isFileExists,
  isRoute,
  isController,
  isComponentJS
} = require('../utils');

module.exports = function addShowModalToImports({ nodePath, projectNameSpace, allFiles, fileName }) {

  if (!(isRoute(fileName) || isController(fileName) || isComponentJS(fileName))) {
    return nodePath
  }
  let showModalPaths = j(nodePath).find(j.CallExpression, getShowModalMatcher());

  showModalPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value;
    if (args.length > 1) {
      let templatePath = args[1];
      if (templatePath.type === 'Literal') {
        let templateName = templatePath.value;
        nodePath.unshift(constructImportDeclaration({ importPath: `${projectNameSpace}/templates/${templateName}` }));

        let hasAssociatedController = isFileExists({ allFiles, fileName: `${projectNameSpace}/controllers/${templateName}` });

        if (!args[2] && hasAssociatedController) { // controller instance is not passed.
          nodePath.unshift(constructImportDeclaration({ importPath: `${projectNameSpace}/controllers/${templateName}` }));
        }
      } else {
        console.log(`----> manual import required ${j(currentPath).toSource()}`);
      }
    }
  });

  return nodePath;
}

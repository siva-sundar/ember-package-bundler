/* eslint-env node */

const j = require('jscodeshift');
const stripDefineStatements = require('./pre-process-plugins/strip-define-statements');
const transformAMDToImportsAndGetExternals = require('./pre-process-plugins/transform-AMD-to-imports-and-get-externals');


function parseStatements(statements) {
  statements.forEach((statement) => {
    statement
  });
}


//
// function populateDependencyImports({ allFiles, nodePath, fileName, projectRoot, projectNameSpace }) {
//
//   if (isRoute(fileName)) {
//
//     nodePath = addTemplateAndControllerToImports({ nodePath, fileName, allFiles, projectNameSpace });
//     nodePath = addInjectControllerToImports({ nodePath, projectNameSpace });
//     nodePath = addShowModalToImports({ nodePath, projectNameSpace, allFiles });
//     nodePath = addControllerForToImports({ nodePath, projectNameSpace });
//     nodePath = addRenderToImports({ nodePath, projectNameSpace });
//
//   } else if (isController(fileName)) {
//
//     nodePath = addInjectControllerToImports({ nodePath, projectNameSpace });
//     nodePath = addShowModalToImports({ nodePath, projectNameSpace, allFiles });
//     nodePath = addControllerForToImports({ nodePath, projectNameSpace });
//
//   } else if (isComponentJS(fileName)) {
//
//     nodePath = addComponentTemplateToImports({ nodePath, fileName, allFiles, projectNameSpace })
//     nodePath = addShowModalToImports({ nodePath, projectNameSpace, allFiles });
//
//   } else if (isTemplate(fileName)) {
//     nodePath = addComponentAndPartialInvocationToImports({ allFiles, nodePath, fileName, projectRoot, projectNameSpace })
//   }
//
//   return nodePath;
// }



function processModuleByNameSpace({ nodePath, allFiles, projectRoot, outputPath, projectNameSpace }) {
  let [fileNode] = nodePath.getValueProperty('arguments');
  let fileName = fileNode.value;
  let filePath = `${outputPath}/${fileName}.js`;
  let externals;
  let nodes;

  // nodePath = transformExportDeclarations(nodePath);
  nodePath = stripDefineStatements(nodePath);
  ({ nodePath, externals } = transformAMDToImportsAndGetExternals({ nodePath, projectNameSpace }));
  nodePath = populateDependencyImports({
    allFiles,
    nodePath,
    fileName,
    projectRoot,
    projectNameSpace
  });

  nodes = j(nodePath).nodes();
  nodePath = j.file(j.program(nodes));
  return {
    rootProjectModule: {
      filePath,
      content: j(nodePath).toSource()
    },
    externals
  };
}

module.exports = {
  getAllModulesAndFiles,
  processModuleByNameSpace
}

/* eslint-env node */
const fs = require('fs');
const j = require('jscodeshift');
const { preprocess } = require('@glimmer/syntax');
const stripBom = require('strip-bom');

const dotTransform = require('./glimmer-plugins/dot-transform');
const getPlugin = require('./glimmer-plugins/component-partial-ast-visitor');
const {
  getDefinePropertyMatcher,
  getTemplateNameMather,
  getControllerNameMather,
  getInjectControllerMathcer,
  getShowModalMatcher,
  getControllerForMatcher,
  getRenderMatcher,
  getLayoutNameMatcher,
  getTemplateStringMatcher,
  getDefaultIdentifierMatcher
} = require('./ast-matcher');
const {
  isRoute,
  isController,
  isTemplate,
  isComponentJS,
  isFileExists,
} = require('./utils');

function buildSpecifiers(importVariable) {
  if (importVariable) {
    return [
      j.importDefaultSpecifier(j.identifier(importVariable))
    ];
  }
  return [];
}

function constructImportDeclaration({
  importVariable,
  importPath = '',
  projectNameSpace
}) {
  importPath = importPath.replace(new RegExp(`^${projectNameSpace}/`), '');
  return j(j.importDeclaration(buildSpecifiers(importVariable), j.literal(importPath))).paths()[0];
}

// function transformExportDeclarations(nodePath) {
//   let expressionStatements = j(nodePath).find(j.ExpressionStatement, {
//     "expression": {
//       "type": "AssignmentExpression",
//       "operator": "=",
//       "left": {
//         "type": "MemberExpression",
//         "object": {
//           "type": "Identifier",
//           "name": "exports"
//         },
//         "computed": false
//       }
//     }
//   });
//
//   expressionStatements.forEach((expressionStatement) => {
//     let assignmentExpression = j(expressionStatement).find(j.AssignmentExpression);
//     if (assignmentExpression.find(j.MemberExpression, { property: { type: 'Identifier', name: 'default' } }).length) {
//       j(expressionStatement).replaceWith(j.exportDefaultDeclaration(assignmentExpression.get('right').value));
//     } else {
//       j(expressionStatement).replaceWith(j.exportDeclaration(assignmentExpression.get('right').value));
//     }
//   })
//   return nodePath;
// }

function stripContent(nodePath) {

  j(nodePath).find(j.ExpressionStatement, getDefinePropertyMatcher()).remove();
  j(nodePath).find(j.ExpressionStatement, {
    expression: {
      type: 'Literal',
      value: 'use strict'
    }
  }).remove();
  return nodePath;
}

function stripDefaultReferences({ nodePath, importVariable }) {
  let defaultIndentifier = j(nodePath).find(j.MemberExpression, getDefaultIdentifierMatcher(importVariable));

  defaultIndentifier.replaceWith(j.identifier(importVariable));
  return nodePath;
}

function transformAMDToImportsAndGetExternals ({ nodePath, projectNameSpace }) {
  let importVariableNode;
  let importPathNode;
  let importPathValue;
  let importVariableName;
  let args = nodePath.get('arguments');
  let imports = [];
  let { value: importPaths } = args.get('1').get('elements');
  let exportFunction = args.get('2');
  let { value: importVariables } = exportFunction.get('params');
  let externals = new Set();

  for (let i = 1; i < importPaths.length; i++) {
    importVariableNode = importVariables[i];
    importPathNode = importPaths[i];
    importPathValue = importPathNode.value;

    if (importVariableNode) {
      importVariableName = importVariableNode.name;
      stripDefaultReferences({ nodePath, importVariable: importVariableNode.name });
    }

    let node = constructImportDeclaration({
      projectNameSpace,
      importVariable: importVariableName,
      importPath: importPathValue
    });
    imports.push(node);
    if (!importPathValue.startsWith(projectNameSpace)) {
      externals.add(importPathValue);
    }
  }
  let exportFunctionPath = j(exportFunction.get('body').getValueProperty('body')).paths();

  return {
    nodePath: [...imports, ...exportFunctionPath],
    externals
  }
}

function addTemplateAndControllerToImports({ nodePath, fileName, allFiles, projectNameSpace }) {

  let templateNameProperty = j(nodePath).find(j.Property, getTemplateNameMather()).find(j.Literal);
  if (templateNameProperty.length) {
    let templatePath = templateNameProperty.get('value').value;
    nodePath.unshift(constructImportDeclaration({
      projectNameSpace,
      importPath: `templates/${templatePath}`
    }));
  } else {
    let templatePath = fileName.replace('/routes/', '/templates/');
    if (isFileExists({ allFiles, fileName: templatePath })) {
      nodePath.unshift(constructImportDeclaration({ importPath: templatePath, projectNameSpace }));
    }
  }

  let controllerNameProperty = j(nodePath).find(j.Property, getControllerNameMather()).find(j.Literal);

  if (controllerNameProperty.length) {
    let controllerPath = controllerNameProperty.get('value').value;
    nodePath.unshift(constructImportDeclaration({ importPath: `controllers/${controllerPath}`, projectNameSpace }));
  } else {
    let controllerPath = fileName.replace('/routes/', '/controllers/');
    if (isFileExists({ allFiles, fileName: controllerPath })) {
      nodePath.unshift(constructImportDeclaration({ importPath: controllerPath, projectNameSpace }));
    }
  }
  return nodePath;
}

function addInjectControllerToImports({ nodePath, projectNameSpace }) {
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
    nodePath.unshift(constructImportDeclaration({ importPath: `/controllers/${name}`, projectNameSpace } ));
  }
  return nodePath;
}

function addShowModalToImports({ nodePath, projectNameSpace, allFiles }) {
  let showModalPaths = j(nodePath).find(j.CallExpression, getShowModalMatcher());

  showModalPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value;
    if (args.length > 1) {
      let templatePath = args[1];
      if (templatePath.type === 'Literal') {
        let templateName = templatePath.value;
        nodePath.unshift(constructImportDeclaration({ importPath: `templates/${templateName}`, projectNameSpace }));

        let hasAssociatedController = isFileExists({ allFiles, fileName: `${projectNameSpace}/controllers/${templateName}` });

        if (!args[2] && hasAssociatedController) { // controller instance is not passed.
          nodePath.unshift(constructImportDeclaration({ importPath: `controllers/${templateName}`, projectNameSpace }));
        }
      } else {
        console.log(`----> manual import required ${j(currentPath).toSource()}`);
      }
    }
  });

  return nodePath;
}

function addControllerForToImports({ nodePath, projectNameSpace }) {
  let controllerForPaths = j(nodePath).find(j.CallExpression, getControllerForMatcher());

  controllerForPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value[0];
    if (args && args.type === 'Literal') {
      let controllerPath = args.value;
      nodePath.unshift(constructImportDeclaration({ importPath: `controllers/${controllerPath}`, projectNameSpace }));
    } else {
      console.log('controller path is dynamic or not passed', j(currentPath).toSource()); // eslint-disable-line no-console
    }
  });
  return nodePath;
}

function addRenderToImports ({ nodePath, projectNameSpace }) {
  let renderPaths = j(nodePath).find(j.CallExpression, getRenderMatcher());
  renderPaths.forEach((currentPath) => {
    let args = currentPath.get('arguments').value;
    args.forEach((arg) => {
      if (arg.type === 'Literal') {
        nodePath.unshift(constructImportDeclaration({ importPath: `/templates/${arg.value}`, projectNameSpace }));
      } else if (arg.type === 'ObjectExpression') {
        let controllerPath = j(arg).find(j.Property, {
          key: {
            name: 'controller'
          }
        }).paths()[0];
        // no need to consider controller value other than a Literal, for instance this.render('apple', { controller: this });
        if (controllerPath && controllerPath.getValueProperty('value').type === 'Literal') {
          nodePath.unshift(constructImportDeclaration({
            importPath: `/controllers/${controllerPath.getValueProperty('value').value}`,
            projectNameSpace
          }));
        }
      }
    })
  });
  return nodePath;
}

function addComponentTemplateToImports({ nodePath, fileName, allFiles, projectNameSpace }) {
  let layoutNameProperty = j(nodePath).find(j.Property, getLayoutNameMatcher()).find(j.Literal);
  if (layoutNameProperty.length) {
    let templatePath = layoutNameProperty.get('value').value;
    nodePath.unshift(constructImportDeclaration({ importPath: `templates/components/${templatePath}`, projectNameSpace }));
  } else {
    let templatePath = fileName.replace('/components/', '/templates/components/');
    if (isFileExists({ allFiles, fileName: templatePath })) {
      nodePath.unshift(constructImportDeclaration({ importPath: templatePath, projectNameSpace }));
    }
  }
  return nodePath;
}

function addComponentAndPartialInvocationToImports({ nodePath, allFiles, projectRoot, projectNameSpace }) {
  let templateStringPath = j(nodePath).find(j.CallExpression, getTemplateStringMatcher());
  if (templateStringPath.length) {
    let partials = new Set();
    let components = new Set();
    templateStringPath = templateStringPath.find(j.Property, { key: { type: 'Literal', value: 'moduleName' } }).paths()[0];
    let templateString = templateStringPath.getValueProperty('value').value;
    let filePath = templateString.replace(projectNameSpace, `${projectRoot}/app`);

    let content = fs.readFileSync(filePath, { encoding: 'utf8' });

    preprocess(stripBom(content), {
      moduleName: filePath,
      rawSource: stripBom(content),
      plugins: {
        ast: [dotTransform, getPlugin({ allFiles, projectRoot, components, partials, projectNameSpace })],
      },
    });
    // console.log(partials, components); //eslint-disable-line
    partials.forEach((importPath) => {
      nodePath.unshift(constructImportDeclaration({ importPath, projectNameSpace }));
    });
    components.forEach((importPath) => {
      nodePath.unshift(constructImportDeclaration({ importPath, projectNameSpace }));
    });
  }

  return nodePath;
}

function populateDependencyImports({ allFiles, nodePath, fileName, projectRoot, projectNameSpace }) {

  if (isRoute(fileName)) {

    nodePath = addTemplateAndControllerToImports({ nodePath, fileName, allFiles, projectNameSpace });
    nodePath = addInjectControllerToImports({ nodePath, projectNameSpace });
    nodePath = addShowModalToImports({ nodePath, projectNameSpace, allFiles });
    nodePath = addControllerForToImports({ nodePath, projectNameSpace });
    nodePath = addRenderToImports({ nodePath, projectNameSpace });

  } else if (isController(fileName)) {

    nodePath = addInjectControllerToImports({ nodePath, projectNameSpace });
    nodePath = addShowModalToImports({ nodePath, projectNameSpace, allFiles });
    nodePath = addControllerForToImports({ nodePath, projectNameSpace });

  } else if (isComponentJS(fileName)) {

    nodePath = addComponentTemplateToImports({ nodePath, fileName, allFiles, projectNameSpace })
    nodePath = addShowModalToImports({ nodePath, projectNameSpace, allFiles });

  } else if (isTemplate(fileName)) {
    nodePath = addComponentAndPartialInvocationToImports({ allFiles, nodePath, fileName, projectRoot, projectNameSpace })
  }
  return nodePath;
}

function getAllModulesAndFiles(ast) {
  let allFiles = [];
  let modulesNodes = ast.find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: 'define',
      },
    })
    modulesNodes.forEach((nodePath) => {
      let fileName = nodePath.getValueProperty('arguments')[0];
      allFiles.push(fileName.value);
    });

  return { allFiles, modulesNodes };
}

function processModuleByNameSpace({ nodePath, allFiles, projectRoot, outputPath, projectNameSpace }) {
  let [fileNode] = nodePath.getValueProperty('arguments');
  let fileName = fileNode.value;
  let filePath = `${outputPath}/${fileName}.js`;
  let externals;
  let nodes;

  // nodePath = transformExportDeclarations(nodePath);
  nodePath = stripContent(nodePath);
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

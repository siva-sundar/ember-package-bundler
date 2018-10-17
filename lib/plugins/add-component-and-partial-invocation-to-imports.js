/* eslint-env node */
const fs = require('fs');
const j = require('jscodeshift');
const { preprocess } = require('@glimmer/syntax');
const stripBom = require('strip-bom');

const {
  getTemplateStringMatcher
} = require('../utils/ast-matcher');
const dotTransform = require('../glimmer-plugins/dot-transform');
const getPlugin = require('../glimmer-plugins/component-partial-ast-visitor');
const { isTemplate } = require('../utils');

module.exports = function addComponentAndPartialInvocationToImports({
  nodePath,
  imports,
  allFiles,
  projectRoot,
  projectNameSpace,
  fileName,
  utils }) {

  if (!isTemplate(fileName)) {
    return imports;
  }

  let templateStringPath = j(nodePath).find(j.CallExpression, getTemplateStringMatcher());

  if (templateStringPath.length) {
    let partials = new Set();
    let components = new Set();
    templateStringPath = templateStringPath.find(j.Property, { key: { type: 'Literal', value: 'moduleName' } }).paths()[0];
    let templateString = templateStringPath.getValueProperty('value').value;
    let filePath = templateString.replace(projectNameSpace, `${projectRoot}/app`); // my-app/templates/loading.hbs => /Home/app/templates/loading.hbs

    let content = fs.readFileSync(filePath, { encoding: 'utf8' });

    preprocess(stripBom(content), {
      moduleName: filePath,
      rawSource: stripBom(content),
      plugins: {
        ast: [dotTransform, getPlugin({ allFiles, projectRoot, components, partials, projectNameSpace })],
      },
    });

    // let compiledBlockNodePath = templateStringPath.find(j.Property, { key: { type: 'Literal', value: 'block' } });
    // let compiledBlock = JSON.parse(compiledBlockNodePath.getValueProperty('value').value);

    // let dynamicImports = parseStatements(compiledBlock.statements);
    // console.log(partials, components); //eslint-disable-line

    partials.forEach((importPath) => {
      let partialFile = utils.resolveFilePath(importPath);

      if (partialFile) {
        imports.push(partialFile);
      }
    });

    components.forEach((importPath) => {
      let componentFile = utils.resolveFilePath(importPath);

      if (componentFile) {
        imports.push(componentFile);
      }
    });
  }

  return imports;
}

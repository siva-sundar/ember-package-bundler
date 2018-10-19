const j = require('jscodeshift');

const { getLayoutNameMatcher } = require('../utils/ast-matcher');
const {
  isComponentJS
} = require('../utils');

module.exports = function addComponentTemplateToImports({ imports, nodePath, fileName, projectNameSpace, util }) {

  if (!isComponentJS(fileName)) {
    return imports;
  }

  let layoutNameProperty = j(nodePath).find(j.Property, getLayoutNameMatcher()).find(j.Literal);

  if (layoutNameProperty.length) {
    let templatePath = layoutNameProperty.get('value').value;
    let templateFile = util.resolveFilePath(`${projectNameSpace}/templates/components/${templatePath}`);

    if (templateFile) {
      imports.push(templateFile);
    }
  } else {
    let templatePath = fileName.replace('/components/', '/templates/components/');
    let templateFile = util.resolveFilePath(templatePath);

    if (templateFile) {
      imports.push(templateFile);
    }
  }

  return imports;
}

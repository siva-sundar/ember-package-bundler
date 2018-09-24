/* eslint-env node */

const {
  isFileExists
} = require('../utils');

function isPartial(node) {
  return node.path.type === 'PathExpression' && node.path.original === 'partial';
}

module.exports = function ({ projectNameSpace, allFiles, partials, components }) {
  const handleMustacheStatementAndSubExpression = ({ node }) => {
    let [firstParam] = node.params;
    if (isPartial(node) &&
        firstParam && firstParam.type === 'StringLiteral') {
          let partialPath = `${projectNameSpace}/templates/${firstParam.value}`;
          if (isFileExists({ allFiles, fileName: partialPath  })) {
            partials.add(partialPath);
          }

    } else if (node.path.original.split('-').length > 1) {

      let componentJSPath = `${projectNameSpace}/components/${node.path.original}`;
      let componentHBSPath = `${projectNameSpace}/templates/components/${node.path.original}`;

      if (isFileExists({ allFiles, fileName: componentJSPath })) {
        components.add(componentJSPath);
      } else if (isFileExists({ allFiles, fileName: componentHBSPath })) {
        components.add(componentHBSPath);
      }
    }
    return node;
  };

  return function () {
    return {
      name: 'transform-component-partial-invocation',

      visitor: {


        MustacheStatement(node) {
          return handleMustacheStatementAndSubExpression({ node });
        },

        SubExpression(node) {
          return handleMustacheStatementAndSubExpression({ node });
        },

        BlockStatement(node) {
          let [firstParam] = node.params;
          if (node.path.original.split('-').length > 1) {
            let componentJSPath = `${projectNameSpace}/components/${node.path.original}`;
            let componentHBSPath = `${projectNameSpace}/templates/components/${node.path.original}`;

            if (isFileExists({ allFiles, fileName: componentJSPath })) {
              components.add(componentJSPath);
            } else if (isFileExists({ allFiles, fileName: componentHBSPath })) {
              components.add(componentHBSPath);
            }
          } else if (node.path.original === 'component' && firstParam && firstParam.type === 'StringLiteral') {

            let componentJSPath = `${projectNameSpace}/components/${firstParam.value}`;
            let componentHBSPath = `${projectNameSpace}/templates/components/${firstParam.value}`;
            if (isFileExists({ allFiles, fileName: componentJSPath })) {
              components.add(componentJSPath);
            } else if (isFileExists({ allFiles, fileName: componentHBSPath })) {
              components.add(componentHBSPath);
            }
          }
        }
      }

    };
  };
};

/* eslint-env node */

function isPartial(node) {
  return node.path.type === 'PathExpression' && node.path.original === 'partial';
}

module.exports = function ({ projectNameSpace, partials, components, util }) {

  const handleMustacheStatementAndSubExpression = ({ node }) => {
    let [firstParam] = node.params;
    if (isPartial(node) &&
        firstParam && firstParam.type === 'StringLiteral') {
          let partialPath = `${projectNameSpace}/templates/${firstParam.value}`;
          let partialFile = util.resolveFilePath(partialPath);
          if (partialFile) {
            partials.add(partialFile);
          }

    } else if (node.path.original.split('-').length > 1) {

      let componentJSPath = `${projectNameSpace}/components/${node.path.original}`;
      let componentHBSPath = `${projectNameSpace}/templates/components/${node.path.original}`;
      let componentJSFile = util.resolveFilePath(componentJSPath);
      let componentHBSFile = util.resolveFilePath(componentHBSPath);

      if (componentJSFile) {
        components.add(componentJSFile);
      } else if (componentHBSFile) {
        components.add(componentHBSFile);
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
            let componentJSFile = util.resolveFilePath(componentJSPath);
            let componentHBSFile = util.resolveFilePath(componentHBSPath);

            if (componentJSFile) {
              components.add(componentJSFile);
            } else if (componentHBSFile) {
              components.add(componentHBSFile);
            }
          } else if (node.path.original === 'component' && firstParam && firstParam.type === 'StringLiteral') {

            let componentJSPath = `${projectNameSpace}/components/${firstParam.value}`;
            let componentHBSPath = `${projectNameSpace}/templates/components/${firstParam.value}`;
            let componentJSFile = util.resolveFilePath(componentJSPath);
            let componentHBSFile = util.resolveFilePath(componentHBSPath);

            if (componentJSFile) {
              components.add(componentJSFile);
            } else if (componentHBSFile) {
              components.add(componentHBSFile);
            }
          }
        }
      }

    };
  };
};

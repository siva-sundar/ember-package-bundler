/* eslint-env node */
/* eslint-disable no-param-reassign */
/**
  In Ember application before compiling the template, ember preprocess it in order to avoid some syntax errors in glimmer-engine. Refer, https://github.com/emberjs/ember.js/blob/v2.13.3/packages/ember-template-compiler/lib/plugins/transform-dot-component-invocation.js.
  We need to do the same here to avoid like this error, https://github.com/rwjblue/ember-template-lint/issues/230.

  Transforms dot invocation of closure components to be wrapped
  with the component helper. This allows for a more static invocation
  of the component.

  ```handlebars
    {{#my-component as |comps|}}
      {{comp.dropdown isOpen=false}}
    {{/my-component}}
  ```
  with
  ```handlebars
    {{#my-component as |comps|}}
      {{component comp.dropdown isOpen=false}}
    {{/my-component}}
  ```
*/

function isMultipartPath(path) {
  return path.parts.length > 1;
}

function isInlineInvocation(path, params, hash) {
  if (isMultipartPath(path)) {
    if (params.length > 0 || hash.pairs.length > 0) {
      return true;
    }
  }

  return false;
}

function wrapInComponent(node, { builders }) {
  let component = node.path;
  let componentHelper = builders.path('component');
  node.path = componentHelper;
  node.params.unshift(component);
}

module.exports = function transformDotComponentInvocation(env) {
  let { syntax: builders } = env;

  return {
    name: 'transform-dot-component-invocation',

    visitor: {
      MustacheStatement: (node) => {
        if (isInlineInvocation(node.path, node.params, node.hash)) {
          wrapInComponent(node, builders);
        }
        return node;
      },
      BlockStatement: (node) => {
        if (isMultipartPath(node.path)) {
          wrapInComponent(node, builders);
        }
        return node;
      },
    }
  };
};

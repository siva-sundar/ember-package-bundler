const j = require('jscodeshift');
const {
  getDefinePropertyMatcher
} = require('../utils/ast-matcher');

module.exports = function stripContent({ nodePath }) {

  j(nodePath).find(j.ExpressionStatement, getDefinePropertyMatcher()).remove();
  j(nodePath).find(j.ExpressionStatement, {
    expression: {
      type: 'Literal',
      value: 'use strict'
    }
  }).remove();
  return nodePath;
}

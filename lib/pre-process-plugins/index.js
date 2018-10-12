/* eslint-env node */
// must perserve the execution order
module.exports = {
  'strip-define-statements': require('./strip-define-statements'),
  'transform-AMD-to-imports': require('./transform-AMD-to-imports')
};

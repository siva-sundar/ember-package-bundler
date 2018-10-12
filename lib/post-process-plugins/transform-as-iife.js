/* eslint-env node */
const { constructIIFE } = require('../utils');
const j = require('jscodeshift');

module.exports = function addComponentAndPartialInvocationToImports({ nodePath, projectNameSpace, fileName }) {

  if (fileName !== `${projectNameSpace}/config/environment`) {
    return nodePath;
  }

  return constructIIFE({ block: j(nodePath).nodes() });
}

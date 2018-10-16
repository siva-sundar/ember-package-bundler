export default function patchRequire() {
  let _require = require;
  window.requirejs = window.require = window.requireModule = function(moduleName) {
    if (_require.has(moduleName)) {
      return _require(...arguments);
    } else {
      return __webpack_require__(moduleName); //eslint-disable-line
    }
  }
}

patchRequire();

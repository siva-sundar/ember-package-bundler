/* eslint-env node */
'use strict';
const path = require('path');
const transformToFiles = require('./lib/index');
module.exports = {
  name: 'ember-webpack-build',

  _ensureFindHost() {
    if (!this._findHost) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;
        /*
          Keep iterating upward until we don't have a grandparent. Has to do this grandparent check because at some point we hit the project.
         */
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
    }
  },

  outputReady() {
    console.log(new Date());
    let projectRoot = __dirname + '/tests/dummy';
    let filePath = `../../dist/assets/dummy.js`;
    let projectNameSpace = 'dummy';

    if (!this.isDevelopingAddon()) {
      this._ensureFindHost();
      let app = this._findHost() || this;
      let name = app.project.name.constructor === Function ? app.project.name() : app.project.name;
      projectRoot = app.project.root,
      filePath = `/dist/assets/${name}.js`,
      projectNameSpace = name;
    }
    transformToFiles({
      projectRoot,
      filePath,
      projectNameSpace
    });
    console.log(new Date());
  }
};

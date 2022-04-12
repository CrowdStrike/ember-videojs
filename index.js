/* eslint-env node */
'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  included() {
    this._super.included.apply(this, arguments);

    this._findHost().import('node_modules/video.js/dist/video-js.css');
  },
};

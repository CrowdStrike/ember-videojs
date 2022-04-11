/* eslint-env node */
'use strict';
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const path = require('path');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  included(app) {
    this._super.included.apply(this, arguments);

    app.import('video.js/dist/video-js.css');
  },
};

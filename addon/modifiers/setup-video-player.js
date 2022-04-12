import videojs from 'video.js';
import 'videojs-vr';

import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';

function cleanup(instance) {
  instance.player?.off(instance.element);
  instance.player?.dispose();
}

export default class SetupVideoPlayer extends Modifier {
  player;
  element;

  ready;
  src;
  html5;
  liveui;
  height;
  width;
  fluid;
  aspectRatio;
  vrProjection;

  events = {
    abort: null,
    canplay: null,
    canplaythrough: null,
    durationchange: null,
    emptied: null,
    ended: null,
    error: null,
    loadeddata: null,
    loadedmetadata: null,
    loadstart: null,
    pause: null,
    play: null,
    playing: null,
    progress: null,
    ratechange: null,
    resize: null,
    seeked: null,
    seeking: null,
    stalled: null,
    suspend: null,
    timeupdate: null,
    useractive: null,
    userinactive: null,
    volumechange: null,
    waiting: null,
    click: null,
    tap: null,
  };

  @tracked crossorigin;

  modify(element, _, named) {
    this.element = element;

    this.ready = named.ready;
    this.src = named.src;
    this.html5 = named.html5;
    this.liveui = named.liveui;
    this.height = named.height;
    this.width = named.width;
    this.fluid = named.fluid;
    this.aspectRatio = named.aspectRatio;
    this.vrProjection = named.vrProjection;

    for (const [eventName] of Object.entries(named)) {
      if ([Object.keys(this.events)].includes(eventName)) {
        this.events[eventName] = named[eventName];
      }
    }

    if (this.player) {
      this.updatePlayer();
    } else {
      this.initPlayer();
    }

    registerDestructor(this, cleanup);
  }

  get playerEvents() {
    return [
      'abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied',
      'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart',
      'pause', 'play', 'playing', 'progress', 'ratechange', 'resize',
      'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'useractive',
      'userinactive', 'volumechange', 'waiting',
      // @queenvictoria added
      'click', 'tap',
    ];
  }

  updatePlayer() {
    let player = videojs(this.element);

    player.pause();
    player.src(this.src);
    player.load();
  }

  initPlayer() {
    const playerOptions = {};

    playerOptions.html5 = this.html5 || {};

    if (this.liveui) {
      playerOptions.liveui = true;
    }

    let player = videojs(this.element, playerOptions);

    if (this.height) {
      player.height(this.height);
    }

    if (this.width) {
      player.width(this.width);
    }

    if (this.fluid) {
      player.fluid(this.fluid);
    }

    if (this.aspectRatio) {
      player.aspectRatio(this.aspectRatio);
    }

    // Register plugins
    // Get global plugins from config.
    if (this.vrProjection) {
      if (typeof player.vr === 'function') {
        this.crossorigin = 'anonymous';

        player.vr({ projection: this.vrProjection });
      } else {
        // TODO: update to correct message
        throw new Error('It looks like you are trying to play a VR video without the videojs-vr library. Please `npm install --save-dev videojs-vr` and add `app.import(\'node_modules/videojs-vr/dist/videojs-vr.min.js\');` to your ember-cli-build.js file.');
      }
    }

    player.ready(() => {
      for (const eventName of this.playerEvents) {
        this.sendActionOnPlayerEvent(player, eventName, eventName);
      }

      this.ready?.(player, this);
    });

    this.player = player;
  }

  sendActionOnPlayerEvent(player, eventName) {
    const listenerFunction = (...args) => {
      this[eventName]?.(this.player, this, ...args);
    };

    player.on(eventName, listenerFunction);
  }
}

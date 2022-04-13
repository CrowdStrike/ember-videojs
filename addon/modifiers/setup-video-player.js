import videojs from 'video.js';
import 'videojs-vr';
import { modifier } from 'ember-modifier';

function setupPlayer(properties) {
  const { element, html5, liveui, height, width, fluid, aspectRatio, vrProjection, playerEvents, ready, events } = properties;
  const playerOptions = {};

  playerOptions.html5 = html5 || {};

  if (liveui) {
    playerOptions.liveui = true;
  }

  let player = videojs(element, playerOptions);

  if (height) {
    player.height(height);
  }

  if (width) {
    player.width(width);
  }

  if (fluid) {
    player.fluid(fluid);
  }

  if (aspectRatio) {
    player.aspectRatio(aspectRatio);
  }

  let crossorigin = '';

  // Register plugins
  // Get global plugins from config.
  if (vrProjection) {
    if (typeof player.vr === 'function') {
      crossorigin = 'anonymous';

      player.vr({ projection: vrProjection });
    } else {
      // TODO: update to correct message
      throw new Error('It looks like you are trying to play a VR video without the videojs-vr library. Please `npm install --save-dev videojs-vr` and add `app.import(\'node_modules/videojs-vr/dist/videojs-vr.min.js\');` to your ember-cli-build.js file.');
    }
  }

  player.ready(() => {
    for (const eventName of playerEvents) {
      sendActionOnPlayerEvent({ player, events, eventName });
    }

    ready?.(player, { crossorigin });
  });

  return player;
}

function sendActionOnPlayerEvent({ player, events, eventName }) {
  const listenerFunction = (...args) => {
    events[eventName]?.(player, this, ...args);
  };

  player.on(eventName, listenerFunction);
}

export default modifier((element, _, named) => {
  const events = {
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

  const playerEvents = [
    'abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied',
    'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart',
    'pause', 'play', 'playing', 'progress', 'ratechange', 'resize',
    'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'useractive',
    'userinactive', 'volumechange', 'waiting',
    // @queenvictoria added
    'click', 'tap',
  ];

  let {
    ready,
    src,
    html5,
    liveui,
    height,
    width,
    fluid,
    aspectRatio,
    vrProjection,
  } = named;

  let player;

  for (const [eventName] of Object.entries(named)) {
    if ([Object.keys(events)].includes(eventName)) {
      events[eventName] = named[eventName];
    }
  }

  if (player) {
    let player = videojs(element);

    player.pause();
    player.src(src);
    player.load();
  } else {
    player = setupPlayer({
      element, html5, liveui, height, width, fluid, aspectRatio, vrProjection, playerEvents, ready, events,
    });
  }

  return () => {
    player?.off(instance.element);
    player?.dispose();
  };
});


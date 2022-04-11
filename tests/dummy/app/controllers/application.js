import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked sources = [
    { src: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'video/mp4' },
    { src: 'https://vjs.zencdn.net/v/oceans.webm', type: 'video/webm' },
  ];

  @action
  play() {
  }

  @action
  ready() {
  }

  @action
  timeupdate(player/*, self, args*/) {
    console.log('Time update: ' + Math.round(player.currentTime()/player.duration()*100) + '%');
  }

  @action
  togglePlay(player) {
    if (!player || typeof player.paused !== 'function') {
      return;
    }

    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
  }
}

import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked sources = [
    { src: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'video/mp4' },
    { src: 'https://vjs.zencdn.net/v/oceans.webm', type: 'video/webm' },
  ];

  player;

  @action
  play() {
  }

  @action
  ready(player) {
    this.player = player;
  }

  @action
  togglePlay() {
    if (!this.player) {
      return;
    }

    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }
}

import Component from '@glimmer/component';

export default class VideoPlayer extends Component {
  defaults = {
    autoplay: false,
    controls: true,
    fluid: false,
    loop: false,
    muted: false,
  };

  get autoplay() {
    return this.args.autoplay ?? this.defaults.autoplay;
  }

  get controls() {
    return this.args.controls ?? this.defaults.controls;
  }

  get fluid() {
    return this.args.fluid ?? this.defaults.fluid;
  }

  get loop() {
    return this.args.loop ?? this.defaults.loop;
  }

  get muted() {
    return this.args.muted ?? this.defaults.muted;
  }
}

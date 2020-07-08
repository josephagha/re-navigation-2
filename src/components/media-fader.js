import { Base } from './base'

export class MediaFader extends Base {
  static get properties() {
    return {
      duration: { type: Number },
    }
  }

  current = 0

  duration = 3000

  prefix = 'data-mf'

  requiredElements = ['media']

  connected() {
    this.start()
  }

  disconnected() {
    this.stop()
  }

  start() {
    if (this.duration) {
      this.timer = setInterval(this.switch, this.duration)
      this.addClass(this, 'media-fader--auto')
    }
  }

  stop() {
    if (this.timer) clearInterval(this.timer)
    this.removeClass(this, 'media-fader--auto')
  }

  switch = () => {
    const medias = this.queryAll('media')
    if (!medias[this.current]) this.current = 0
    medias.forEach((media, idx) => {
      if (idx === this.current) {
        this.addClass(media, 'media-fader__item--active')
      } else {
        this.removeClass(media, 'media-fader__item--active')
      }
    })
    this.current++
  }
}

customElements.define('aida-media-fader', MediaFader)

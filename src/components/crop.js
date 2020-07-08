import { Base } from './base'

export class Crop extends Base {
  prefix = 'data-crop'

  requiredElements = ['element']

  connected() {
    const elem = this.query('element')
    if (this.getTagName(elem) === 'img') {
      this.addEvent(elem, 'load', this.resizedImage)
      this.addEvent(
        window,
        'orientationchange',
        this.multipleResizes(this.resizedImage),
      )
      this.addEvent(window, 'resize', this.multipleResizes(this.resizedImage))
      this.resizedImage()
    }
    if (this.getTagName(elem) === 'video') {
      this.addEvent(elem, 'load', this.resizedVideo)
      this.addEvent(elem, 'loadedmetadata', this.resizedVideo)
      this.addEvent(elem, 'loadeddata', this.resizedVideo)
      this.addEvent(
        window,
        'orientationchange',
        this.multipleResizes(this.resizedVideo),
      )
      this.addEvent(window, 'resize', this.multipleResizes(this.resizedVideo))
      this.resizedVideo()
    }
  }

  // TODO: replace this with a resizeobserver
  // Fix for iPad/Tablet orientation changes
  multipleResizes = func => {
    return () => {
      func()
      setTimeout(func, 500)
      setTimeout(func, 2000)
    }
  }

  resizedImage = () => {
    const elem = this.query('element')
    this.setClass(elem.naturalHeight, elem.naturalWidth)
  }

  resizedVideo = () => {
    const elem = this.query('element')
    this.setClass(elem.videoHeight, elem.videoWidth)
  }

  setClass(height, width) {
    const landscape = this.offsetHeight / this.offsetWidth < height / width
    if (landscape) {
      this.removeClass(this.query('element'), 'crop__item--portrait')
    } else {
      this.addClass(this.query('element'), 'crop__item--portrait')
    }
  }
}

customElements.define('aida-crop', Crop)

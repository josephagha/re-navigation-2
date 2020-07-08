import { Base } from './base'

export class Price extends Base {
  static get properties() {
    return {
      price: { type: Number },
    }
  }
  value

  requiredElements = ['value']

  price = 0
  prefix = 'data-price'
  reqId = null

  duration = 1000

  animate = timestamp => {
    if (this.current === this.price) return
    if (!this.start) this.start = timestamp
    const progress = timestamp - this.start
    if (progress >= this.duration) {
      this.current = this.price
      this.setValue()
      this.start = null
      return
    }
    this.calcValue(progress)
    this.reqId = window.requestAnimationFrame(this.animate)
  }

  connected() {
    this.current = this.from = this.price
    this.setValue()
  }

  calcValue(progress) {
    const value =
      this.from +
      (this.price - this.from) * this.easing(progress / this.duration)

    this.current = value
    this.setValue()
  }

  easing(t) {
    return Math.sqrt(1 - (t = t - 1) * t)
  }

  setValue() {
    this.query('value').innerHTML = this.current
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }

  updated(oldProps) {
    if (oldProps.has('price')) {
      this.from = this.current
      if (this.reqId) {
        window.cancelAnimationFrame(this.reqId)
        this.reqId = null
      }
      this.start = null
      window.requestAnimationFrame(this.animate)
    }
  }
}

customElements.define('aida-price', Price)

import { Base } from './base'

export class Counter extends Base {
  static get properties() {
    return {
      min: { type: Number },
      max: { type: Number },
      pValue: { type: Number },
      value: { type: Number, reflect: true },
    }
  }

  pValue = 0

  prefix = 'data-c'

  requiredElements = ['decrease', 'increase', 'value']

  connected() {
    this.addEvent(this.query('increase'), 'click', this.increase)
    this.addEvent(this.query('decrease'), 'click', this.decrease)
    if (this.value) {
      this.pValue = this.value
    }
  }

  firstUpdated() {
    if (this.value === undefined) {
      this.value = 0
    }
  }

  decrease = () => {
    this.setValue(this.pValue - 1)
  }

  increase = () => {
    this.setValue(this.pValue + 1)
  }

  update(oldProp) {
    if (oldProp.has('value') && oldProp.get('value') !== this.value) {
      this.setValue(this.value)
    }
    if (oldProp.has('min') || oldProp.has('max')) {
      this.setValue(this.pValue)
    }
    this.setClasses()
    super.update()
  }

  setClasses() {
    this.setClass(
      this.query('decrease'),
      'counter__minus--disabled',
      this.pValue <= this.min,
    )
    this.setClass(
      this.query('increase'),
      'counter__plus--disabled',
      this.pValue >= this.max,
    )
  }

  setValue(value) {
    this.pValue = this.clampValue(value)
    if (this.pValue !== this.value) {
      this.value = this.pValue
      this.change(this, false, true, 'counter_change')
    }
    this.setValueOrText(this.queryAll('value'), this.value)
  }

  clampValue(value) {
    const min = this.min !== undefined ? this.min : value
    const max =
      this.max !== undefined
        ? this.max
        : this.min
        ? Math.max(this.min, value)
        : value
    return Math.min(Math.max(value, min), max)
  }
}

customElements.define('aida-counter', Counter)

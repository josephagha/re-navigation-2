import { Base } from './base'

export class Pax extends Base {
  static get properties() {
    return {
      adults: { attribute: false, type: Number },
      juveniles: { attribute: false, type: Number },
      childrens: { attribute: false, type: Number },
    }
  }

  prefix = 'data-pax'
  requiredElements = [
    'adults',
    'juveniles',
    'childrens',
    'adultsinput',
    'juvenilesinput',
    'childrensinput',
  ]

  get options() {
    const max = 5
    const sum = this.sum
    return {
      minAdults: 0,
      maxAdults: sum >= max ? this.adults : this.adults + max - sum,
      minJuveniles: 0,
      maxJuveniles: sum >= max ? this.juveniles : this.juveniles + max - sum,
      minChildrens: 0,
      maxChildrens:
        sum >= max ? this.childrens : Math.min(this.childrens + max - sum, 4),
    }
  }
  get sum() {
    return this.adults + this.juveniles + this.childrens
  }

  connected() {
    this.addEvent(this.query('adults'), 'counter_change', this.changeValue)
    this.addEvent(this.query('juveniles'), 'counter_change', this.changeValue)
    this.addEvent(this.query('childrens'), 'counter_change', this.changeValue)
    this.addEvent(
      this.query('adultsinput'),
      'aida_ext_change',
      this.setValuesFromInputs,
    )
    this.addEvent(
      this.query('juvenilesinput'),
      'aida_ext_change',
      this.setValuesFromInputs,
    )
    this.addEvent(
      this.query('childrensinput'),
      'aida_ext_change',
      this.setValuesFromInputs,
    )
    this.setValuesFromInputs()
  }

  changeValue = () => {
    const element = this.query('activator')
    if (element) {
      element.classList.add('selected')
    }
    this.setValuesFromCounter()
  }

  changeInput = () => {
    // TODO: handle external changes
  }

  checkValues(adultsChanges) {
    if (this.adults === 0 && this.juveniles === 0) {
      adultsChanges ? (this.juveniles = 1) : (this.adults = 1)
      this.setCounterValues()
    }
  }

  setValuesFromCounter() {
    this.adults = parseInt(this.query('adults').value, 10)
    this.juveniles = parseInt(this.query('juveniles').value, 10)
    this.childrens = parseInt(this.query('childrens').value, 10)
  }

  setValuesFromInputs = () => {
    this.adults = parseInt(this.query('adultsinput').value, 10)
    this.juveniles = parseInt(this.query('juvenilesinput').value, 10)
    this.childrens = parseInt(this.query('childrensinput').value, 10)
  }

  setInputValues() {
    this.setValueOrText(this.query('adultsinput'), this.adults)
    this.setValueOrText(this.query('juvenilesinput'), this.juveniles)
    this.setValueOrText(this.query('childrensinput'), this.childrens)
    this.setValueOrText(this.query('value'), this.sum)
  }

  updateMinMax() {
    const options = this.options
    this.query('adults').setAttribute('min', options.minAdults)
    this.query('adults').setAttribute('max', options.maxAdults)
    this.query('juveniles').setAttribute('min', options.minJuveniles)
    this.query('juveniles').setAttribute('max', options.maxJuveniles)
    this.query('childrens').setAttribute('min', options.minChildrens)
    this.query('childrens').setAttribute('max', options.maxChildrens)
  }

  setCounterValues() {
    this.query('adults').value = this.adults
    this.query('juveniles').value = this.juveniles
    this.query('childrens').value = this.childrens
  }

  update(oldProps) {
    if (
      oldProps.has('adults') ||
      oldProps.has('juveniles') ||
      oldProps.has('childrens')
    ) {
      this.updateMinMax()
      this.setCounterValues()
      this.checkValues(oldProps.get('adults') >= 0)
      this.setInputValues()
    }
    super.update()
  }
}

customElements.define('aida-pax', Pax)

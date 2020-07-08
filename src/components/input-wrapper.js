import { Base } from './base'

export class InputWrapper extends Base {
  prefix = 'data-inwr'
  requiredElements = ['placeholder', 'wrapper']

  connected() {
    // const wrapper = this.query('wrapper')
    // const input = wrapper.firstElementChild
    // const placeholder = this.query('placeholder')
  }
}

customElements.define('aida-input-wrapper', InputWrapper)

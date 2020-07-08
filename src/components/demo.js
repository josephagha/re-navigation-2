import { Base } from './base'

export class Test extends Base {
  static get properties() {
    return {
      colors: { type: String },
    }
  }

  colors = 'black,green,red,blue,orange,yellow,pink'

  requiredElements = ['button']

  get _colors() {
    return this.colors.split(',')
  }

  connected() {
    this.addEvent(this.query('button'), 'click', () => {
      this.style.backgroundColor = this._colors[Math.floor(Math.random() * 6)]
    })
  }
}

customElements.define('aida-test', Test)

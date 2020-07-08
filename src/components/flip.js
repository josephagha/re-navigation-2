import { Base, html } from './base'

export class Flip extends Base {
  static get properties() {
    return {
      val: { type: Number },
    }
  }

  idx = 0

  updated(oldProps) {
    if (oldProps.has('val') && oldProps.get('val') !== this.val) {
      this.lastValue = this.val
    }
  }

  render() {
    // hack to trigger rerendering of whole elements - TODO: find out how to do this the right way
    const hack = []
    hack[this.idx] = this.idx
    this.idx = 1 - this.idx
    return html`
      <div class="flip-wrapper">
        <ul class="flip">
          <li class="current">
            ${this.val}
          </li>
          ${hack.map(
            val => html`
              <li class="active" key="${this.val}">
                <div class="up">
                  <div class="inn">${this.val}</div>
                </div>
                <div class="down">
                  <div class="rotate">
                    <div class="inn">
                      <div class="lower-half">${this.val}</div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="before" key="${this.lastValue}">
                <div class="up">
                  <div class="rotate">
                    <div class="inn">${this.lastValue}</div>
                  </div>
                </div>
                <div class="down">
                  <div class="inn">
                    <div class="lower-half">${this.lastValue}</div>
                  </div>
                </div>
              </li>
            `,
          )}
        </ul>
      </div>
    `
  }
}

customElements.define('aida-flip', Flip)

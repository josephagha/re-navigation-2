import { Base } from './base'

export class Toggle extends Base {
  static get properties() {
    return {
      classToggle: { type: String },
      disableDocumentClick: { type: Boolean, default: false },
      initialActivate: { type: Boolean, default: false },
    }
  }

  prefix = 'data-tg'

  connected() {
    this.addEvent(this.queryAll('activator'), 'click', this.toggle)
    this.addEvent(this.queryAll('deactivator'), 'click', this.hide)
    if (this.initialActivate) this.show()
  }

  getContent() {
    const contentElements = this.queryAll('content')
    return contentElements.length ? contentElements : [this]
  }

  show() {
    this.addClass(this.getContent(), this.classToggle)
    if (this.disableDocumentClick) return
    this.addDocumentClick(this.hide, [
      // TODO: queryAll activator and exclude them in DocumentClick
      ...this.queryAll('activator'),
      ...this.getContent(),
    ])
  }

  hide = () => {
    this.removeClass(this.getContent(), this.classToggle)
  }

  toggle = () => {
    !this.hasClass(this.getContent(), this.classToggle)
      ? this.show()
      : this.hide()
  }
}

customElements.define('aida-toggle', Toggle)

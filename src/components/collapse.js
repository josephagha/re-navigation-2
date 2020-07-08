import { Base } from './base'

export class Collapse extends Base {
  prefix = 'data-tg'
  requiredElements = ['activator']

  // maxHeight is only used for internal check of hide/show
  maxHeight = 0

  connected() {
    this.addEvent(this.queryAll('activator'), 'click', this.toggle)
    this.addEvent(this.queryAll('deactivator'), 'click', this.hide)
  }

  getContent() {
    // content needs class "collapse--hidden"
    // and child with class "collapse-content" in html
    return this.query('content') || this
  }

  getActivatorIcon() {
    return this.query('activator-icon')
  }

  show() {
    const content = this.getContent()
    // get height of invisible child
    const clientHeight =
      content.children && content.children[0]
        ? content.children[0].offsetHeight
        : 0
    // set maxHeight to value of childs height
    content.style.maxHeight = clientHeight + 'px'

    // if icon in activator and height is really expanding,
    // rotate the icon (e.g. chevron-down)
    const activatorIcon = this.getActivatorIcon()
    if (activatorIcon && clientHeight > 0) {
      activatorIcon.style.transform = 'rotate(180deg)'
    }

    this.maxHeight = clientHeight
  }

  hide = () => {
    const content = this.getContent()
    // close content div
    content.style.maxHeight = 0

    // reset activator icon
    const activatorIcon = this.getActivatorIcon()
    if (activatorIcon) {
      activatorIcon.style.transform = ''
    }

    this.maxHeight = 0
  }

  toggle = () => {
    this.maxHeight === 0 ? this.show() : this.hide()
  }
}

customElements.define('aida-collapse', Collapse)

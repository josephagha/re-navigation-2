import { html, LitElement } from 'lit-element'
export { html }
export class Base extends LitElement {
  static get properties() {
    return {
      prefix: { type: String },
    }
  }
  prefix = 'data'

  requiredElements = []

  events = []

  eventDocumentClick = null

  addEvent(element, event, handler, options = {}) {
    if (Array.isArray(element)) {
      element.forEach(elem => {
        this.addEvent(elem, event, handler, options)
      })
      return
    }
    if (!element || !element.addEventListener)
      return console.info('event handler could not be assigned')
    // TODO: improve this - see setValueOrText
    element.addEventListener(event, handler, options)
    this.events.push([element, event, handler])
  }

  removeEvent(element, event, handler) {}

  removeEvents() {
    this.events.forEach((event, idx) => {
      event[0].removeEventListener(event[1], event[2])
      delete this.events[idx]
    })
  }

  addDocumentClick(func, exceptions = []) {
    this.removeDocumentClick()
    this.eventDocumentClick = event => {
      if (!event.target) {
        return
      }
      let isClickInside = false
      exceptions.forEach(element => {
        if (element.contains(event.target)) isClickInside = true
      })
      if (!isClickInside) {
        func()
      }
    }
    document.addEventListener('click', this.eventDocumentClick)
  }

  removeDocumentClick() {
    if (!this.eventDocumentClick) return
    document.removeEventListener('click', this.eventDocumentClick)
  }

  change(element, bubbles = true, cancelable = true, event = 'change') {
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent(event, bubbles, cancelable)
    element.dispatchEvent(evt)
    return
  }

  connectedCallback() {
    this.initialChilds = this.children
    try {
      this.requiredElements.map(elems => {
        const elements = this.queryAll(elems)
        if (!elements.length) throw `${this.prefix}-${elems} not found`
      })
      super.connectedCallback()
      this.connected()
    } catch (e) {
      console.info(e)
    }
  }
  connected() {}

  disconnectedCallback() {
    this.removeEvents()
    this.removeDocumentClick()
    super.disconnectedCallback()
    this.disconnected()
  }

  disconnected() {}

  addClass(element, classString = '') {
    if (Array.isArray(element)) {
      element.forEach(elem => {
        this.addClass(elem, classString)
      })
      return
    }
    classString.split(' ').map(cl => {
      if (cl) element.classList.add(cl)
    })
  }

  hasClass(element, classString = '') {
    if (Array.isArray(element)) {
      return element.filter(elem => this.hasClass(elem, classString)).length > 0
    }
    return classString.split(' ').some(cl => {
      if (cl) return element.classList.contains(cl)
    })
  }

  removeClass(element, classString = '') {
    if (Array.isArray(element)) {
      element.forEach(elem => {
        this.removeClass(elem, classString)
      })
      return
    }
    classString.split(' ').map(cl => {
      if (cl) element.classList.remove(cl)
    })
  }

  setClass(element, classString, add) {
    add
      ? this.addClass(element, classString)
      : this.removeClass(element, classString)
  }

  toggleClass(element, classString = '') {
    classString.split(' ').map(cl => {
      if (cl) element.classList.toggle(cl)
    })
  }

  createRenderRoot() {
    return this
  }

  getTagName(element) {
    return element ? element.tagName.toLowerCase() : ''
  }

  query(elem) {
    return this.querySelector(`[${this.prefix}-${elem}]`)
  }

  queryAll(elem) {
    const result = this.querySelectorAll(`[${this.prefix}-${elem}]`)
    if (!result) return []
    return Array.from(result)
  }

  setValueOrText(element, value, tiggerChange = true) {
    if (Array.isArray(element)) {
      element.forEach(elem => {
        this.setValueOrText(elem, value, tiggerChange)
      })
      return
    }
    if (element) {
      if (['input', 'select'].indexOf(element.tagName.toLowerCase()) !== -1) {
        if (element.value === value) return
        element.value = value
        if (tiggerChange) this.change(element)
      } else {
        element.innerHTML = value
      }
    }
  }
}

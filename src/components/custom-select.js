import { Base } from './base'

export class Select extends Base {
  static get properties() {
    return {
      classKeySelect: { type: String },
      classSelect: { type: String },
      classShow: { type: String },
    }
  }

  prefix = 'data-cs'

  requiredElements = ['input', 'activator', 'options', 'option']

  classKeySelect = 'key-select'
  classSelect = 'active'
  classShow = 'show'

  currentKeySelect = null

  connected() {
    if (this.query('keycontrol')) {
      this.addEvent(this.query('keycontrol'), 'keydown', this.eventKey)
    }
    this.addEvent(this.queryAll('activator'), 'click', this.toggle)
    this.addEvent(this.query('options'), 'click', this.optionClick)
    this.addEvent(this.query('input'), 'aida_ext_change', this.updateValue)
    this.updateValue()
  }

  eventKey = e => {
    e.preventDefault()
    const currentKeySelect = this.currentKeySelect
    switch (e.keyCode) {
      case 13:
      case 32:
        this.select(this.queryAll('option')[currentKeySelect])
        break
      case 39:
      case 40:
        if (!this.visible()) return this.show()
        this.currentKeySelect =
          currentKeySelect === null ||
          currentKeySelect >= this.queryAll('option').length - 1
            ? 0
            : currentKeySelect + 1
        break
      case 37:
      case 38:
        if (!this.visible()) return this.show()
        this.currentKeySelect =
          currentKeySelect === null || currentKeySelect <= 0
            ? this.queryAll('option').length - 1
            : currentKeySelect - 1
        break
    }
    this.updateOptions()
  }

  getText(option) {
    return option.getAttribute('data-text') || option.textContent.trim()
  }

  getValue(option) {
    return option.getAttribute('data-value') || this.getText(option)
  }

  updateOptions = () => {
    this.queryAll('option').map((option, idx) => {
      if (
        this.getValue(option) === this.query('input').value &&
        this.currentKeySelect === null
      ) {
        this.currentKeySelect = idx
      }
      this.setClass(option, this.classKeySelect, idx === this.currentKeySelect)
      this.setClass(
        option,
        this.classSelect,
        this.getValue(option) === this.query('input').value,
      )
    })
  }

  updateValue = () => {
    this.queryAll('option').map((option, idx) => {
      if (this.getValue(option) === this.query('input').value) {
        this.select(option, true)
      }
    })
  }

  showOptions = () => {
    this.show()
  }

  optionClick = e => {
    const options = this.queryAll('option')
    const target = this.getEventTarget(e)
    options.forEach(option => {
      if (option.contains(target)) {
        this.select(option)
      }
    })
  }

  select(option, textOnly = false) {
    const text = this.getText(option)
    const value = this.getValue(option)
    if (!textOnly) this.setValueOrText(this.query('input'), value)
    this.setValueOrText(this.query('text'), text, false)
    this.setClass(
      this.queryAll('select'),
      'selected',
      this.query('input').value !== '',
    )
    this.hide()
  }

  getEventTarget(e) {
    e = e || window.event
    return e.target || e.srcElement
  }

  visible() {
    return this.hasClass(this.query('options'), this.classShow)
  }

  show() {
    this.currentKeySelect = null
    this.updateOptions()
    this.addClass(this.query('options'), this.classShow)
    this.addDocumentClick(this.hide, [
      ...this.queryAll('activator'),
      this.query('options'),
    ])
  }

  hide = () => {
    this.removeClass(this.query('options'), this.classShow)
  }

  toggle = () => {
    !this.hasClass(this.query('options'), this.classShow)
      ? this.show()
      : this.hide()
  }
}
customElements.define('aida-custom-select', Select)

import { Base } from './base'

export class Modal extends Base {
  static get properties() {
    return {
      toggleId: { type: String },
    }
  }

  prefix = 'data-md'
  requiredElements = ['activator']

  connected() {
    this.addEvent(this.queryAll('activator'), 'click', this.toggle)
  }

  getParent() {
    return this.query('parent') || this
  }

  toggle = () => {
    const id = this.toggleId
    const modalElement = document.getElementById(id)
    if (!!modalElement && modalElement.hasAttribute("class", "d-none")) {
      modalElement.addEventListener('click', this.hide)
      this.show(modalElement)
    }
  }

  show(modalElement) {
    modalElement.classList.remove("d-none")
  }

  hide() {
    const id = this.id
    const modalElementHide = document.getElementById(id)
    modalElementHide.classList.add("d-none")
  }
}

customElements.define('aida-modal', Modal)
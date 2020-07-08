import { Base, html } from './base'

export class Countdown extends Base {
  static get properties() {
    return {
      diff: { type: Object },
      from: { type: String },
      reloadIfFinished: { type: Boolean },
      to: { type: String },
    }
  }

  fromDate = new Date()

  connected() {
    if (!this.to) throw 'prop to missing'
    if (this.from) this.fromDate = new Date(this.from)
    this.toDate = new Date(this.to)
    this.start()
  }

  disconnected() {
    this.stop()
  }

  render() {
    return html`
      ${this.diff &&
        this.diff.map(timePart => {
          return html`
            <div class="countdown__part">
              <div class="countdown__flips">
                ${timePart.val.split('').map(figure => {
                  return html`
                    <aida-flip val=${figure}></aida-flip>
                  `
                })}
              </div>
              <div class="countdown__label">${timePart.label}</div>
            </div>
          `
        })}
    `
  }

  start() {
    this.timer = setInterval(this.tick, 1000)
  }

  stop() {
    if (this.timer) clearInterval(this.timer)
  }

  tick = () => {
    const ms = Math.max(0, this.toDate.getTime() - this.fromDate.getTime())

    if (ms === 0) {
      this.stop()
      return
    }
    this.fromDate.setSeconds(this.fromDate.getSeconds() + 1)
    this.diff = [
      {
        val: Math.floor(ms / 86400000)
          .toString()
          .padStart(2, '0'),
        label: 'Tage',
      },
      {
        val: (Math.floor(ms / 3600000) % 24).toString().padStart(2, '0'),
        label: 'Stunden',
      },
      {
        val: (Math.floor(ms / 60000) % 60).toString().padStart(2, '0'),
        label: 'Minuten',
      },
      {
        val: (Math.floor(ms / 1000) % 60).toString().padStart(2, '0'),
        label: 'Sekunden',
      },
    ]
  }
}

customElements.define('aida-countdown', Countdown)

import { Base, html } from './base'

export class Datepicker extends Base {
  static get properties() {
    return {
      _currentDate: { attribute: false, type: Date },
      _displayMonths: { attribute: false, type: Number },
      _hoverEndDate: { attribute: false, type: Date },
      _startDate: { attribute: false, type: Date },
      _endDate: { attribute: false, type: Date },

      big: { type: Boolean }, // big ? 3 : 1
      classWrapper: { type: String },
      current: { type: String }, // current month as date as string
      end: { type: String, reflect: true }, // if range
      formattedValue: { type: String, reflect: true },
      labelEmpty: { type: String },
      labelReset: { type: String },
      labelSeperator: { type: String },
      labelsMonth: { type: String },
      labelsWeekDay: { type: String },
      max: { type: String }, // max date as string
      min: { type: String }, // min date as string
      range: { type: Boolean },
      show: { type: Boolean, reflect: true },
      start: { type: String, reflect: true }, // if range
      date: { type: String, reflect: true }, // if not range
    }
  }

  classWrapper = ''
  current = null
  labelEmpty = 'Bitte Wählen'
  labelsMonth =
    'Januar,Februar,März,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember'
  labelReset = 'Zurücksetzen'
  labelStart = 'ab'
  labelSeperator = 'bis'
  labelsWeekDay = 'MO,DI,MI,DO,FR,SA,SO'
  max = null
  min = null

  _currentDate = null
  _displayMonths = 1
  _endDate = null
  _hoverEndDate = null
  _startDate = null
  _lastCurrent = null

  get _currentMonth() {
    if (this._lastCurrent !== this.current) {
      this._currentDate = null
      this._lastCurrent = this.current
    }
    // default - datepicker is in use - without props changed
    if (this._currentDate && this.inMinMaxRange(this._currentDate)) {
      return getFirstDateOfMonth(this._currentDate)
    }
    // initial with current or if current prop changed
    if (!this._currentDate && this._lastCurrent) {
      const lastCurrent = new Date(this._lastCurrent)
      if (this.inMinMaxRange(lastCurrent))
        return getFirstDateOfMonth(lastCurrent)
    }
    // initial without current
    return getFirstDateOfMonth(this._minDate)
  }

  set _currentMonth(currentDate) {
    this._currentDate = currentDate
  }

  get _labelsMonth() {
    return this.labelsMonth.split(',')
  }

  get _labelsWeekDay() {
    return this.labelsWeekDay.split(',')
  }

  get _maxDate() {
    const maxDate = this.max ? new Date(this.max) : new Date()
    maxDate.setHours(23, 59, 59, 0)
    if (!this.max) {
      maxDate.setFullYear(maxDate.getFullYear() + 30)
    }
    return maxDate
  }

  get _minDate() {
    const minDate = this.min ? new Date(this.min) : new Date()
    minDate.setHours(0, 0, 0, 0)
    if (!this.min) {
      minDate.setFullYear(minDate.getFullYear() - 30)
    }
    return minDate
  }

  get _months() {
    const start = new Date(this._currentMonth)
    const end = new Date(this._currentMonth)
    const diffEnd = monthDiff(getFirstDateOfMonth(this._maxDate), end)
    const displayMonth = Math.min(this._displayMonths - 1, diffEnd)
    end.setMonth(end.getMonth() + displayMonth)
    const dates = []
    while (start <= end) {
      const month = start.getMonth()
      dates.push(new Date(start))
      start.setMonth(month + 1)
    }
    return {
      dates,
      prev:
        getFirstDateOfMonth(this._currentMonth).getTime() !=
          getFirstDateOfMonth(this._minDate).getTime()
          ? () => {
            const currentDate = new Date(this._currentMonth)
            currentDate.setMonth(currentDate.getMonth() - 1)
            this._currentMonth = currentDate
          }
          : null,
      next:
        diffEnd > displayMonth
          ? () => {
            const currentDate = new Date(this._currentMonth)
            currentDate.setMonth(currentDate.getMonth() + 1)
            this._currentMonth = currentDate
          }
          : null,
    }
  }

  connected() {
    this._displayMonths = this.big ? 3 : 1
  }

  emit() {
    if (this.range) {
      this.start = getDateString(this._startDate)
      this.end = getDateString(this._endDate)
    } else {
      this.date = getDateString(this._startDate)
    }
    this.setFormattedDate()
  }

  firstUpdated() {
    this.addEvent(window, 'resize', this.resize)
    this.addEvent(window, 'orientationchange', this.resize)

    this.datepicker = this.querySelector('.dp')
    this.resize()
  }

  inMinMaxRange(date) {
    return date >= this._minDate && date <= this._maxDate
  }

  inRange(date) {
    if (
      !this.range ||
      !this._startDate ||
      (!this._endDate && !this._hoverEndDate)
    )
      return false
    const start = this._endDate
      ? this._startDate
      : this._hoverEndDate >= this._startDate
        ? this._startDate
        : this._hoverEndDate
    const end = this._endDate
      ? this._endDate
      : this._hoverEndDate >= this._startDate
        ? this._hoverEndDate
        : this._startDate
    return date >= start && date <= end
  }

  render = () => {
    return html`
      ${this.initialChilds}
      <div class="dp ${this.show ? 'dp--show' : ''} ${this.classWrapper}">
        <div
          class="btn btn--small dp__button-reset ${this._startDate
        ? 'dp__button-reset--enabled'
        : ''}"
          @click=${this.reset}
        >
          ${this.labelReset}
        </div>
        <div
          class="dp__button dp__button--left ${!this._months.prev
        ? 'dp__button dp__button--disabled'
        : ''}"
          @click=${this._months.prev}
        ></div>
        <div
          class="dp__button dp__button--right ${!this._months.next
        ? 'dp__button dp__button--disabled'
        : ''}"
          @click=${this._months.next}
        ></div>
        ${this._months.dates.map(monthDate => {
          return html`
            <div class="dp__month">
              <div class="dp__month__head">
                <span class="dp__month__head__month"
                  >${this._labelsMonth[monthDate.getMonth()]}</span
                >
                <span class="dp__month__head__year"
                  >${monthDate.getFullYear()}</span
                >
              </div>
              <div class="dp__month__days">
                <div class="dp__month__days__head">
                  ${this._labelsWeekDay.map(day => {
            return html`
                      <div class="dp__month__days__head__tile">${day}</div>
                    `
          })}
                </div>
                <div class="dp__month__days__body">
                  ${getDaysOfMonth(monthDate).map(day => {
                    return html`
                      <div
                        @click=${this.tileClick(day)}
                        @mouseover=${this.tileHover(day)}
                        class="dp__month__days__body__tile ${this.tileClasses(
                          day,
                          monthDate,
                        )}"
                        data-testid=${getDayTestid(day, monthDate)}
                      >
                        <span>${day.getDate()}</span>
                      </div>
                    `
                    })}
                </div>
              </div>
            </div>
          `
        })}
      </div>
    `
  }

  reset = () => {
    this.setDates(null, null)
  }

  resize = () => {
    if (!this.big || !this.show) return
    let displayMonths = 3
    if (this.datepicker.offsetWidth <= 800) {
      displayMonths = 2
    }
    if (this.datepicker.offsetWidth <= 600) {
      displayMonths = 1
    }
    this._displayMonths = displayMonths
  }

  setInternalDates(date1, date2) {
    const _date1 = this.validDate(date1)
    const _date2 = this.validDate(date2)
    if (!_date1) {
      this._startDate = null
      this._endDate = null
      return true
    }
    if (!this.range) {
      this._startDate = _date1 || _date2
      this._endDate = _date1 || _date2
      return true
    }
    if (date2 === undefined) {
      if (!this._startDate || (this._startDate && this._endDate)) {
        this._endDate = null
        this._startDate = _date1
      } else if (this._startDate > _date1) {
        this._endDate = new Date(this._startDate)
        this._startDate = _date1
      } else {
        this._endDate = _date1
      }
      return this._endDate !== null
    }
    this._startDate = _date1 <= _date2 ? _date1 : _date2
    this._endDate = _date1 <= _date2 ? _date2 : _date1
    return true
  }

  setDates(date1, date2) {
    if (this.setInternalDates(date1, date2)) this.show = false
    this._hoverEndDate = null
    this.emit()
  }

  setFormattedDate() {
    if (!this.range) {
      this.formattedValue = this._startDate
        ? getFormattedDate(this._startDate)
        : this.labelEmpty
      return
    }

    const start = getFormattedDate(this._startDate)
    const end = getFormattedDate(this._endDate) || null
    const value = (start == end || !end)
      ? `${start} ${this.labelSeperator} ${getFormattedDate(this._maxDate)}`
      : `${start} ${this.labelSeperator} ${end}`
    this.formattedValue = value
  }

  tileClasses(tileDate, monthDate) {
    const classes = []
    if (!this.inMinMaxRange(tileDate))
      classes.push('dp__month__days__body__tile--disabled')
    if (tileDate.getMonth() !== monthDate.getMonth()) {
      if (this._displayMonths === 1) {
        classes.push('dp__month__days__body__tile--other-month')
      } else {
        classes.push('dp__month__days__body__tile--hide')
      }
    }

    if (
      this._startDate &&
      (this._endDate || this._hoverEndDate) &&
      this._startDate.getTime() === tileDate.getTime() &&
      !(
        this._endDate && this._startDate.getTime() === this._endDate.getTime()
      ) &&
      !(
        this._hoverEndDate &&
        this._startDate.getTime() === this._hoverEndDate.getTime()
      )
    ) {
      if (this._endDate || this._startDate <= this._hoverEndDate) {
        classes.push('dp__month__days__body__tile--range-start')
      } else {
        classes.push('dp__month__days__body__tile--range-end')
      }
    }

    if (
      this._startDate &&
      this._startDate.getTime() === tileDate.getTime() &&
      ((!this._endDate && !this._hoverEndDate) ||
        (this._hoverEndDate &&
          this._startDate.getTime() === this._hoverEndDate.getTime()) ||
        (this._endDate &&
          this._startDate.getTime() === this._endDate.getTime()))
    ) {
      classes.push('dp__month__days__body__tile--selected')
    }

    if (
      this._endDate &&
      this._endDate.getTime() === tileDate.getTime() &&
      this._startDate.getTime() !== this._endDate.getTime()
    ) {
      classes.push('dp__month__days__body__tile--range-end')
    }

    if (
      !this._endDate &&
      this._hoverEndDate &&
      this._hoverEndDate.getTime() === tileDate.getTime() &&
      this._startDate.getTime() !== this._hoverEndDate.getTime()
    ) {
      if (this._startDate <= this._hoverEndDate) {
        classes.push('dp__month__days__body__tile--range-end')
      } else {
        classes.push('dp__month__days__body__tile--range-start')
      }
    }

    if (this.inRange(tileDate)) {
      classes.push('dp__month__days__body__tile--in-range')
      if (
        this._startDate &&
        (tileDate.getMonth() === monthDate.getMonth() ||
          this._displayMonths === 1) &&
        tileDate.getDay() === 1
      ) {
        classes.push('dp__month__days__body__tile--range-first')
      } else if (
        this._startDate &&
        this._displayMonths > 1 &&
        tileDate.getDate() === 1
      ) {
        classes.push('dp__month__days__body__tile--range-first')
      }

      if (
        this._startDate &&
        (tileDate.getMonth() === monthDate.getMonth() ||
          this._displayMonths === 1) &&
        tileDate.getDay() === 0
      ) {
        classes.push('dp__month__days__body__tile--range-last')
      } else if (
        this._startDate &&
        this._displayMonths > 1 &&
        tileDate.getDate() === getLastDayOfMonth(tileDate).getDate()
      ) {
        classes.push('dp__month__days__body__tile--range-last')
      }
    }

    return classes.join(' ')
  }

  tileClick(date) {
    return () => {
      this.setDates(date)
    }
  }

  tileHover(date) {
    return () => {
      if (this.range && this._startDate && !this._endDate) {
        this._hoverEndDate = date
      }
    }
  }

  toggle = () => {
    this.show = !this.show
  }

  updated(oldProps) {
    if (this.range) {
      if (
        oldProps.has('start') &&
        oldProps.has('end') &&
        !compareDates(this.start, this._startDate) &&
        !compareDates(this.end, this._endDate)
      ) {
        this.setDates(this.start, this.end)
      } else {
        if (
          oldProps.has('start') &&
          !compareDates(this.start, this._startDate)
        ) {
          this._startDate = null
          this._endDate = null
          this.setDates(this.start)
        }
        if (oldProps.has('end') && !compareDates(this.end, this._endDate)) {
          this._endDate = null
          this.setDates(this._startDate ? this.end : null)
        }
      }
    } else {
      if (oldProps.has('date') && !compareDates(this.date, this._startDate)) {
        this.setDates(this.date)
      }
    }

    if (
      oldProps.has('formattedValue') &&
      oldProps.get('formattedValue') !== this.formattedValue
    ) {
      this.change(this, false, true, 'datepicker_change')
    }

    this.resize()
  }

  validDate(date) {
    return isDate(date) && this.inMinMaxRange(getDateZeroHours(date))
      ? getDateZeroHours(date)
      : null
  }
}

customElements.define('aida-datepicker', Datepicker)

export class DatePickerReflector extends Base {
  prefix = 'data-dp'
  requiredElements = ['date', 'datepicker', 'activator', 'value']

  eventChange = () => {
    this.setValueOrText(
      this.query('date'),
      this.query('datepicker').getAttribute('date'),
    )
    this.setValueOrText(
      this.query('value'),
      this.query('datepicker').getAttribute('formattedValue'),
    )
  }

  connected() {
    this.addEvent(this.queryAll('activator'), 'click', this.toggle)
    this.addEvent(
      this.query('datepicker'),
      'datepicker_change',
      this.eventChange,
    )
    this.addEvent(this.query('date'), 'aida_ext_change', () => {
      this.setDatepickerValues()
    })
  }

  firstUpdated() {
    this.setDatepickerValues()
  }

  setDatepickerValues = () => {
    this.query('datepicker').setAttribute('date', this.query('date').value)
  }

  show = () => {
    this.query('datepicker').setAttribute('show', 'true')
    this.addDocumentClick(this.hide, [
      this.query('datepicker'),
      ...this.queryAll('activator'),
    ])
  }

  hide = () => {
    this.query('datepicker').removeAttribute('show')
  }

  toggle = () => {
    this.query('datepicker').getAttribute('show') ? this.hide() : this.show()
  }
}

customElements.define('aida-datepicker-reflector', DatePickerReflector)

export class DateRangePickerReflector extends DatePickerReflector {
  prefix = 'data-dp'
  requiredElements = ['date', 'date-end', 'datepicker', 'activator', 'value']

  eventChange = () => {
    const element = this.query('activator')
    if (element) {
      element.classList.add("selected")
    }
    this.setValueOrText(
      this.query('date'),
      this.query('datepicker').getAttribute('start'),
    )
    this.setValueOrText(
      this.query('date-end'),
      this.query('datepicker').getAttribute('end'),
    )
    this.setValueOrText(
      this.query('value'),
      this.query('datepicker').getAttribute('formattedValue'),
    )
  }

  connected() {
    this.addEvent(this.queryAll('activator'), 'click', this.toggle)
    this.addEvent(
      this.query('datepicker'),
      'datepicker_change',
      this.eventChange,
    )
    this.addEvent(this.query('date'), 'aida_ext_change', () => {
      this.setDatepickerValues()
    })
    this.addEvent(this.query('date-end'), 'aida_ext_change', () => {
      this.setDatepickerValues()
    })
  }

  setDatepickerValues = () => {
    this.query('datepicker').setAttribute('start', this.query('date').value)
    this.query('datepicker').setAttribute('end', this.query('date-end').value)
  }
}

customElements.define(
  'aida-daterangepicker-reflector',
  DateRangePickerReflector,
)

//////// HELPER ////////////

function monthDiff(date2, date1) {
  const diff =
    (date2.getTime() - date1.getTime()) / 1000 / (60 * 60 * 24 * 7 * 4)

  return Math.abs(Math.round(diff))
}

function getDateString(date) {
  if (!date) return ''
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate(),
  )}`
}

function getDaysOfMonth(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  if (start.getDay() !== 1) {
    start.setDate(
      start.getDay() === 0
        ? start.getDate() - 6
        : start.getDate() - (start.getDay() - 1),
    )
  }
  if (end.getDay() !== 0) end.setDate(end.getDate() + (7 - end.getDay()))

  const days = []
  while (start <= end) {
    const day = start.getDate()
    days.push(new Date(start))
    start.setDate(day + 1)
  }
  return days
}

function getFirstDateOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0)
}

function getFormattedDate(date) {
  if (!date) return
  return `${padNumber(date.getDate())}.${padNumber(
    date.getMonth() + 1,
  )}.${date.getFullYear()}`
}

function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0)
}

function padNumber(number) {
  return number.toString().padStart(2, '0')
}

function isDate(date) {
  return !!Date.parse(date)
}

function getDateZeroHours(date) {
  const zero = new Date(date)
  zero.setHours(0, 0, 0, 0)

  return zero
}

function getDayTestid(day, monthDate) {
  return day.getMonth() === monthDate.getMonth() ?
    day.getMonth() + '_' + day.getDate() :
    ''
}

function compareDates(date1, date2) {
  const _d1 = isDate(date1) ? getDateZeroHours(date1) : null
  const _d2 = isDate(date2) ? getDateZeroHours(date2) : null
  return !_d1 && !_d2
    ? true
    : !_d1 || !_d2
      ? false
      : _d1.getTime() === _d2.getTime()
}

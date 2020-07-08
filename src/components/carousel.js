import { Base } from './base'

export class Carousel extends Base {
  static get properties() {
    return {}
  }

  currentIdx = 1

  duration = 600

  prefix = 'data-carousel'

  requiredElements = ['item', 'track']

  startX = null
  currentX = 0
  tempCurrentX = null
  targetX = null

  touchActive = false

  get isActive() {
    return this.queryAll('item').length > 1
  }

  clampValue(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  connected() {
    if (!this.isActive) {
      const track = this.query('track')
      if (track) {
        track.style.height = '100%'
      }
      return
    }
    this.addEvent(this, 'dragstart', e => e.preventDefault())
    this.addEvent(this, 'mousedown', this.dragstart)
    this.addEvent(this, 'mousemove', this.drag)
    this.addEvent(this, 'mouseleave', this.dragend)
    this.addEvent(this, 'mouseup', this.dragend)
    this.addEvent(this, 'touchstart', this.dragstart)
    this.addEvent(this, 'touchmove', this.drag)
    this.addEvent(this, 'touchend', this.dragend)
    this.addEvent(this, 'touchcancel', this.dragend)
    this.addEvent(this, 'touchleave', this.dragend)
    this.addEvent(window, 'wheel', this.wheel, {
      passive: !1,
    })
    this.queryAll('dot').forEach(dot => {
      this.addEvent(dot, 'mousedown', e => e.stopPropagation())
      this.addEvent(dot, 'touchstart', e => e.stopPropagation())
      this.addEvent(dot, 'click', e => {
        e.stopPropagation()
        const value = parseInt(dot.getAttribute('data-carousel-value'), 10)
        this.currentIdx = value + 1
        this.jumpToIdx()
      })
    })

    this.dots = this.queryAll('dot')
    this.items = this.queryAll('item')
    this.track = this.query('track')
    this.track.insertBefore(
      this.items[this.items.length - 1].cloneNode(true),
      this.track.firstChild,
    )
    this.track.appendChild(this.items[0].cloneNode(true))
    this.items = this.queryAll('item')

    this.addEvent(
      window,
      'orientationchange',
      this.multipleResizes(this.resize),
    )
    this.addEvent(window, 'resize', this.multipleResizes(this.resize))
    this.addEvent(window, 'scroll', this.scroll)

    this.resize()
    this.jumpToIdx(true)
  }

  firstUpdated() {
    if (this.isActive) this.resize()
  }

  dragstart = e => {
    if (this.touchActive) return
    this.touchActive = true
    this.moveAbortAnimate()
    this.startX = this.getX(e)
    this.lastX = this.startX
    this.dist = 0
  }

  drag = e => {
    if (this.startX === null) return
    const x = this.getX(e)
    if (this.isVerticalSlide(e) || this.wheelActive) {
      this.lastX = x
      return
    } else {
      e.preventDefault()
    }
    this.dist += x - this.lastX
    this.direction = this.lastX ? Math.sign(x - this.lastX) : Math.sign(val)
    this.lastX = x
    const width = this.offsetWidth
    const val = this.dist - this.startX
    const calculatedCurrentX = this.currentX + this.dist
    this.tempCurrentX = this.clampValue(
      calculatedCurrentX,
      -(this.items.length - 1) * width,
      0,
    )
    if (this.tempCurrentX === 0) {
      this.currentX = this.currentX - width * (this.items.length - 2)
      this.currentIdx = this.items.length - 2
      return this.drag(e)
    }
    if (this.tempCurrentX === -(width * (this.items.length - 1))) {
      this.currentX = this.currentX + width * (this.items.length - 2)
      this.currentIdx = 1
    }
    this.setPosition()
  }

  dragend = e => {
    this.touchActive = false
    this.startX = null
    if (this.tempCurrentX === null) {
      this.jumpToIdx()
      return
    }
    const diff = this.tempCurrentX - this.currentX
    this.currentX = this.tempCurrentX
    this.tempCurrentX = null
    this.setClosest(diff)
    this.jumpToIdx()
  }

  getX(e) {
    return e.targetTouches === undefined ? e.pageX : e.targetTouches[0].screenX
  }

  getXOfCurrentIdx() {
    const width = this.offsetWidth

    if (this.currentIdx < 0) this.currentIdx = 0
    if (this.items.length - 1 < this.currentIdx)
      this.currentIdx = this.items.length - 1
    return -(width * this.currentIdx)
  }

  isVerticalSlide(e) {
    if (e.targetTouches === undefined) return
    const x = e.targetTouches[0].clientX
    const y = e.targetTouches[0].clientY
    if (this.lastClientX === undefined) this.lastClientX = x
    if (this.lastClientY === undefined) this.lastClientY = y

    if (Math.abs(this.lastClientY - y) >= Math.abs(this.lastClientX - x)) {
      this.lastClientX = x
      this.lastClientY = y
      return true
    }
  }

  jumpToIdx(fast = false) {
    this.moveAbortAnimate()
    if (fast) {
      this.currentX = this.getXOfCurrentIdx()
      this.setPosition()
      this.checkIdx()
      return
    }
    this.setDots()
    this.fromX = this.currentX
    this.targetX = this.getXOfCurrentIdx()
    window.requestAnimationFrame(this.moveAnimate)
  }

  checkIdx() {
    if (this.currentIdx === 0) {
      this.currentIdx = this.items.length - 2
      this.currentX = this.getXOfCurrentIdx()
      this.setPosition()
    }

    if (this.currentIdx === this.items.length - 1) {
      this.currentIdx = 1
      this.currentX = this.getXOfCurrentIdx()
      this.setPosition()
    }
    this.setDots()
  }

  setDots() {
    this.removeClass(this.dots, 'carousel__dot-wrapper--active')
    const dotIdx =
      this.currentIdx === 0
        ? this.items.length - 3
        : this.currentIdx === this.items.length - 1
        ? 0
        : this.currentIdx - 1
    if (this.dots[dotIdx]) {
      this.addClass(this.dots[dotIdx], 'carousel__dot-wrapper--active')
    }
  }

  moveAnimate = timestamp => {
    if (this.currentX === this.targetX) return this.checkIdx()
    if (!this.start) this.start = timestamp
    const progress = timestamp - this.start
    if (progress >= this.duration) {
      this.currentX = this.targetX
      this.start = null
      this.setPosition()
      this.checkIdx()
      return
    }
    this.currentX = this.calcValue(progress)
    this.setPosition()
    this.reqId = window.requestAnimationFrame(this.moveAnimate)
  }

  calcValue(progress) {
    const value =
      this.fromX +
      (this.targetX - this.fromX) * this.easing(progress / this.duration)
    return value
  }

  easing(t) {
    return --t * t * t + 1
  }

  moveAbortAnimate() {
    if (this.reqId) {
      window.cancelAnimationFrame(this.reqId)
      this.reqId = null
    }
    this.start = null
  }

  // TODO: replace this with a resizeobserver
  // Fix for iPad/Tablet orientation changes
  multipleResizes = func => {
    return () => {
      func()
      setTimeout(func, 500)
      setTimeout(func, 2000)
    }
  }

  resize = () => {
    const width = this.offsetWidth
    const height = this.offsetHeight

    this.track.style.width = width * this.items.length + 'px'
    this.track.style.height = height + 'px'
    if (!this.touchActive) this.jumpToIdx(true)
  }

  setClosest(diff) {
    if (
      diff < 0 &&
      this.direction < 0 &&
      this.currentIdx < this.items.length - 1
    ) {
      return this.currentIdx++
    }
    if (diff > 0 && this.direction > 0 && this.currentIdx > 0) {
      return this.currentIdx--
    }
  }

  setPosition() {
    const val = this.tempCurrentX !== null ? this.tempCurrentX : this.currentX
    this.track.style.transform = `translate3d(${val}px,0,0)`
  }

  wheel = e => {
    if (this.touchActive) e.preventDefault()
  }

  scroll = e => {
    this.wheelActive = true
    window.clearTimeout(this.isScrolling)
    this.isScrolling = setTimeout(() => {
      this.wheelActive = false
    }, 100)
  }
}

customElements.define('aida-carousel', Carousel)

;(() => {
  function resize() {
    const vh = window.innerHeight * 0.01
    // USAGE: height: 100vh; height: calc(var(--vh, 1vh) * 100);
    window.document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  // TODO: enable this for resize events - but without flickering - use throttling or a timeout
  // window.addEventListener('resize', resize)
  window.addEventListener('orientationchange', resize)

  window.document.addEventListener('DOMContentLoaded', () => {
    resize()
  })
  resize()
})()

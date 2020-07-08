import { Base } from './base'

export class Navbar extends Base {
  connected() {
    let navbarContainer = document.querySelector('.navbar')
    let openNav = 'is-open-nav'
    let closeNav = 'is-close-nav'

    let navbar = document.querySelector('.navbar__nav')
    let activeNavbar = 'is-active-navbar__nav'

    let navbarItem = document.querySelectorAll('.navbar__item')

    let allNavLevel1 = document.querySelectorAll('.navbar__nav--level-1')
    let activeNavLevel1 = 'is-active-level-1'
    let unactiveNavLevel1 = 'is-unactive-level-1'
    let activeCurrentNavLevel1 = 'is-active-current-level-1'

    let flyoutBg = document.querySelector('.navbar__flyout-bg')

    let flyoutGrey = document.querySelector('.navbar__flyout-bg-grey')
    let activeFlyoutGrey = 'is-active-flyout-grey'

    let flyoutBgMobile = document.querySelector('.navbar__flyout-sm-bg')
    let openFlyoutSm = 'is-open-flyout-sm-bg'
    let closeFlyoutSm = 'is-close-flyout-sm-bg'

    let burgerIcon = document.querySelector('.navbar__burger')
    let unactiveBurgerIcon = 'is-unactive-burger-icon'
    let activeBurgerIcon = 'is-active-burger-icon'

    let currentNavbarLevel2
    let activeNavLevel2 = 'is-active-level-2'
    let unactiveNavLevel2 = 'is-unactive-level-2'

    let isBurgerIconOpen
    let showcaseStop

    let breakpointsSm = 1024
    let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click'

    let widthOnOpen = window.innerWidth
    let detectIPadOrientation = 1

    this.addEvent(window, 'orientationchange', () => {
      window.innerWidth > breakpointsSm
        ? closeNavbar('Desktop')
        : closeNavbar('Mobile')
    })

    this.addEvent(window, 'resize', () => {
      touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click'

      if (window.innerWidth != widthOnOpen) {
        window.innerWidth > breakpointsSm
          ? closeNavbar('Desktop')
          : closeNavbar('Mobile')
      }
    })

    // on page start
    this.addEvent(window, 'load', () => {
      if (window.innerWidth > breakpointsSm) {
        openNavbar('Desktop')

        setTimeout(() => {
          isShowcase()
        }, 2000)

        let isShowcase = () => {
          if (showcaseStop) return

          closeNavbar('Desktop')
        }
      }
    })

    // menu - Mobile
    this.addEvent(window, touchEvent, e => {
      if (burgerIcon.contains(e.target)) {
        !isBurgerIconOpen ? openNavbar('Mobile') : closeNavbar('Mobile')
      }
      if (window.orientation == 90 || window.orientation == -90) {
        navbarContainer.contains(e.target)
          ? openNavbar('Desktop')
          : closeNavbar('Desktop')
      }
    })

    // menu - Desktop
    this.addEvent(window, 'mouseover', e => {
      showcaseStop = true
      if (window.innerWidth > breakpointsSm) {
        if (navbarContainer.contains(e.target)) {
          openNavbar('Desktop')
        } else {
          closeNavbar('Desktop')
        }
      }
    })

    // submenu
    for (let i = 0; i < navbarItem.length; i++) {
      this.addEvent(navbarItem[i], touchEvent, e => {
        let currentNavLevel1

        //find currentNavLevel1 Value
        if (e.target.classList.contains('navbar__nav--level-1')) {
          currentNavLevel1 = e.target
        } else {
          e.target.tagName.toLowerCase() == 'i' ||
          e.target.tagName.toLowerCase() == 'img' ||
          e.target.tagName.toLowerCase() == 'span' ||
          e.target.classList.contains('arrow-icon')
            ? (currentNavLevel1 = e.target.parentElement)
            : e.target.tagName.toLowerCase() == 'div' ||
              e.target.tagName == 'svg'
            ? (currentNavLevel1 = e.target.parentElement.parentElement)
            : (currentNavLevel1 =
                e.target.parentElement.parentElement.parentElement)
        }

        window.innerWidth < breakpointsSm
          ? //submenu - Mobile
            toggleSubNavbar('Mobile', currentNavLevel1, e.target, navbarItem[i])
          : //submenu - Desktop
            toggleSubNavbar(
              'Desktop',
              currentNavLevel1,
              e.target,
              navbarItem[i],
            )
      })
    }

    const toggleSubNavbar = (mediaType, currentNavItem, target, navbarItem) => {
      let currentNavLevel1 = currentNavItem

      if (mediaType === 'Desktop') {
        for (let index = 0; index < allNavLevel1.length; index++) {
          if (
            currentNavLevel1 != allNavLevel1[index] &&
            allNavLevel1[index].classList.contains(activeCurrentNavLevel1)
          ) {
            if (currentNavLevel1.classList.contains('navbar__nav--level-1')) {
              this.removeClass(allNavLevel1[index], activeCurrentNavLevel1)
              if (
                allNavLevel1[index].nextElementSibling.classList.contains(
                  activeNavLevel2,
                )
              ) {
                this.removeClass(
                  allNavLevel1[index].nextElementSibling,
                  activeNavLevel2,
                )
                this.addClass(
                  allNavLevel1[index].nextElementSibling,
                  unactiveNavLevel2,
                )
              }
            } else {
              return
            }
          }

          if (
            currentNavLevel1 == allNavLevel1[index] &&
            !allNavLevel1[index].classList.contains(activeCurrentNavLevel1)
          ) {
            if (!navbarContainer.classList.contains(openNav)) {
              openNavbar('Desktop')
            }

            if (navbarContainer.classList.contains(openNav)) {
              this.addClass(currentNavLevel1, activeCurrentNavLevel1)

              flyoutBg.classList.contains(closeFlyoutSm)
                ? flyoutBg.classList.replace(closeFlyoutSm, openFlyoutSm)
                : this.addClass(flyoutBg, openFlyoutSm)

              currentNavbarLevel2 = navbarItem.querySelector(
                '.navbar__nav--level-2',
              )

              this.removeClass(currentNavbarLevel2, unactiveNavLevel2)
              this.addClass(currentNavbarLevel2, activeNavLevel2)
            }
          } else if (
            currentNavLevel1 == allNavLevel1[index] &&
            allNavLevel1[index].classList.contains(activeCurrentNavLevel1)
          ) {
            flyoutBg.classList.replace(openFlyoutSm, closeFlyoutSm)
            this.removeClass(currentNavLevel1, activeCurrentNavLevel1)
            if (
              currentNavLevel1.nextElementSibling.classList.contains(
                activeNavLevel2,
              )
            ) {
              this.removeClass(
                currentNavLevel1.nextElementSibling,
                activeNavLevel2,
              )
              this.addClass(
                currentNavLevel1.nextElementSibling,
                unactiveNavLevel2,
              )
            }
          }
        }
      }
      if (mediaType === 'Mobile') {
        if (
          navbarItem.querySelector('.navbar__nav--level-2').contains(target)
        ) {
          if (
            navbarItem
              .querySelector('.navbar__nav--level-2')
              .querySelector('.arrow-icon-level-2')
              .contains(target)
          ) {
            this.removeClass(navbar, activeNavLevel1)
            this.addClass(navbar, unactiveNavLevel1)

            this.removeClass(flyoutGrey, activeFlyoutGrey)
          } else {
            return
          }
        }

        for (let index = 0; index < allNavLevel1.length; index++) {
          if (currentNavLevel1 == allNavLevel1[index]) {
            this.addClass(currentNavLevel1, activeCurrentNavLevel1)

            currentNavbarLevel2 = navbarItem.querySelector(
              '.navbar__nav--level-2',
            )

            this.removeClass(currentNavbarLevel2, unactiveNavLevel2)
            this.addClass(currentNavbarLevel2, activeNavLevel2)

            this.removeClass(navbar, unactiveNavLevel1)
            this.addClass(navbar, activeNavLevel1)

            this.addClass(flyoutGrey, activeFlyoutGrey)
          } else {
            this.removeClass(allNavLevel1[index], activeCurrentNavLevel1)
            if (
              allNavLevel1[index].nextElementSibling.classList.contains(
                activeNavLevel2,
              )
            ) {
              this.removeClass(
                allNavLevel1[index].nextElementSibling,
                activeNavLevel2,
              )
              this.addClass(
                allNavLevel1[index].nextElementSibling,
                unactiveNavLevel2,
              )
            }
          }
        }
      }
    }

    const openNavbar = mediaType => {
      if (mediaType === 'Desktop') {
        this.addClass(navbarContainer, openNav)
        this.removeClass(navbarContainer, closeNav)
      }
      if (mediaType === 'Mobile') {
        this.removeClass(burgerIcon, unactiveBurgerIcon)
        this.addClass(burgerIcon, activeBurgerIcon)

        this.removeClass(flyoutBgMobile, closeFlyoutSm)
        this.addClass(flyoutBgMobile, openFlyoutSm)

        navbar.style.height = window.innerHeight + 'px'

        this.addClass(navbarItem[0].parentElement, activeNavbar)

        isBurgerIconOpen = true
      }
    }

    const closeNavbar = mediaType => {
      if (mediaType === 'Desktop') {
        if (flyoutBg.classList.contains(openFlyoutSm)) {
          flyoutBg.classList.replace(openFlyoutSm, closeFlyoutSm)
          if (currentNavbarLevel2.classList.contains(activeNavLevel2)) {
            this.removeClass(currentNavbarLevel2, activeNavLevel2)
            this.addClass(currentNavbarLevel2, unactiveNavLevel2)
          }
          if (
            currentNavbarLevel2.previousElementSibling.classList.contains(
              activeCurrentNavLevel1,
            )
          ) {
            this.removeClass(
              currentNavbarLevel2.previousElementSibling,
              activeCurrentNavLevel1,
            )
          }
        }
        if (navbarContainer.classList.contains(openNav)) {
          this.removeClass(navbarContainer, openNav)
          this.addClass(navbarContainer, closeNav)

          setTimeout(() => {
            this.removeClass(navbarContainer, closeNav)
          }, 500)
        }
      }
      if (mediaType === 'Mobile') {
        navbar.style.height = ''

        this.addClass(flyoutBgMobile, closeFlyoutSm)
        this.removeClass(flyoutBgMobile, openFlyoutSm)

        this.addClass(burgerIcon, unactiveBurgerIcon)
        this.removeClass(burgerIcon, activeBurgerIcon)

        this.removeClass(navbarItem[0].parentElement, activeNavbar)

        for (let index = 0; index < allNavLevel1.length; index++) {
          if (allNavLevel1[index].classList.contains(activeCurrentNavLevel1)) {
            this.removeClass(allNavLevel1[index], activeCurrentNavLevel1)
          }
          this.removeClass(allNavLevel1[index], activeNavLevel1)
          this.removeClass(
            allNavLevel1[index].nextElementSibling,
            activeNavLevel2,
          )
          this.removeClass(
            allNavLevel1[index].nextElementSibling,
            unactiveNavLevel2,
          )
        }

        setTimeout(() => {
          this.removeClass(
            document.querySelector('.navbar__flyout-bg-grey'),
            activeFlyoutGrey,
          )

          this.removeClass(navbar, activeNavLevel1)
          this.addClass(navbar, unactiveNavLevel1)
        }, 200)

        isBurgerIconOpen = false
      }
    }
  }
}

customElements.define('aida-navbar', Navbar)

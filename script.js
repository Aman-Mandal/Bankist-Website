'use strict'

// Modal window
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')
const btnScrollTo = document.querySelector('.btn--scroll-to')

// section
const section1 = document.getElementById('section--1')

const nav = document.querySelector('.nav')

// Tabbed var
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

const closeModal = function () {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}

// open modal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

// close modal
btnCloseModal.addEventListener('click', closeModal)

overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

// ScrollTo Button
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect()
  console.log(s1coords)

  section1.scrollIntoView({ behavior: 'smooth' })
})

// ---------------EVENT DELEGATION ----------------

// 1. Add eventListener to the common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault()
  // e.target gives the element on which the event has happened
  // console.log(e.target)

  // 2. Determine which element originated the event
  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})

// Operations Tabbed component
tabsContainer.addEventListener('click', function (e) {
  // closest method
  const clicked = e.target.closest('.operations__tab')

  // Guard clause
  if (!clicked) return // If nothing clicked then return

  // Activate Tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active')
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  )

  // Activate content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active')
})

// Menu Fade animation
const menuFade = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this
      logo.style.opacity = this
    })
  }
}

// Passing "argument" in handler function using .bind()
nav.addEventListener('mouseover', menuFade.bind(0.5))

nav.addEventListener('mouseout', menuFade.bind(1))

// -------------------Sticky Navigation Bar-------------------

// INTERSECTION OBSERVER API
const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height
// console.log(navHeight)

const stickyNav = function (entries) {
  const [entry] = entries
  // console.log(entry)

  if (!entry.isIntersecting) {
    nav.classList.add('sticky')
  } else {
    nav.classList.remove('sticky')
  }
}

// observer api
const headerObserver = new IntersectionObserver(stickyNav, {
  threshold: 0,
  root: null,
  rootMargin: `-${navHeight}px`,
})
headerObserver.observe(header)

// ----------------Reveal Sections------------------

const allSections = document.querySelectorAll('.section')

// callback
const revealSection = function (entries, observer) {
  const [entry] = entries

  // Guard clause
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')

  // unobserve method
  observer.unobserve(entry.target)
}

// Intersection Observer API
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
})

allSections.forEach(function (section) {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

// --------------------LAZY LOADING---------------

const imgTargets = document.querySelectorAll('img[data-src]')

const loadImg = function (entries, observer) {
  const [entry] = entries
  console.log(entry)

  // Guard Clause
  if (!entry.isIntersecting) return

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src

  // using Load event
  entry.target.addEventListener('load', function () {
    // remove blur filter
    entry.target.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target)
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-250px',
})

imgTargets.forEach(img => imgObserver.observe(img))

// --------------Slides ---------------

const slide = function () {
  const slides = document.querySelectorAll('.slide')
  const btnRight = document.querySelector('.slider__btn--right')
  const btnLeft = document.querySelector('.slider__btn--left')
  const dotContainer = document.querySelector('.dots')

  let curSlide = 0
  const maxSlide = slides.length

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    })
  }

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'))

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active')
  }

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    )
  }

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0
    } else {
      curSlide++
    }
    goToSlide(curSlide)
    activateDots(curSlide)
  }

  // Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1
    } else {
      curSlide--
    }
    goToSlide(curSlide)
    activateDots(curSlide)
  }

  const init = function () {
    createDots()
    activateDots(0)
    goToSlide(0)
  }

  init()

  // Event Handlers
  btnRight.addEventListener('click', nextSlide)

  btnLeft.addEventListener('click', prevSlide)

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide()
    if (e.key === 'ArrowLeft') prevSlide()
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide
      goToSlide(slide)
      activateDots(slide)
    }
  })
}
slide()

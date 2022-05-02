'use strict'

///////////////////////////////////////
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

// Page Navigation

// Note : By using ScrollIntoView on every particular link... it needs to create that callback function
// every time.. which is way too much

// ---------By Using "ScrollIntoView"---------
// document.querySelectorAll('.nav__link').forEach(function (link) {
//   link.addEventListener('click', function (e) {
//     e.preventDefault()
//     const id = this.getAttribute('href')
//     // console.log(id)
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
//   })
// })

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

// using 'Scroll' Event : Never Use it
// const initailCoords = section1.getBoundingClientRect()

// window.addEventListener('scroll', function () {
//   // console.log(this.window.scrollY, initailCoords)

//   window.scrollY > initailCoords.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky')
// })

// using Intersection Observer API
// const obsCallback = function(entries){
//   entries.forEach(entry => console.log(entry))
// }

// const options = {
//   root: null,
//   threshold: [0, 0.2, 1],
// }
// const observer = new IntersectionObserver(obsCallback, options)
// observer.observe(section1)

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

// ////////////////////////
// ///////////////////////
// //////////////////////
// // Practice

// // ----------------Selecting, Creating and Deleting -----------------

// // ----------Selecting-------

// console.log(document.documentElement) // Selects whole document
// console.log(document.head) // Selects head of html
// console.log(document.body) // Selects body

// console.log(document.querySelector('.header'))

// // Note : It returns a NODELIST
// const sections = console.log(document.querySelectorAll('.section'))

// document.getElementById('section--1')

// // Note : Both returns a HTMLCollection
// document.getElementsByTagName('button') // selects element by the html name
// document.getElementsByClassName('btn') // selects element by the class

// // ------Creating -----------

// // insertAdjacentElement

// // createElement()
// const message = document.createElement('div')
// message.classList.add('cookie-message')

// message.innerHTML =
//   'We use cookies in this website . <button class = "btn btn--close-cookie" >Got It!</button> '

// const header = document.querySelector('.header')

// // --------Inserting elements-----

// // header.prepend(message) // Adds element to the first position of header
// header.append(message) // Adds element to the last of header

// // header.before(message) // Adds before the header
// // header.after(message) // Adds after the header

// // ------------Deleting ------------

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove() // deletes the element
//     // message.parentElement.removeChild(message)
//   })

// // ----------- Styles ---------------

// message.style.backgroundColor = '#37383d'
// message.style.width = '120%'

// // Note : getComputedStyle() gives the style of the CSS sheet
// console.log(getComputedStyle(message).height)

// // Adding height customly using the getComputedStyle()
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px'

// // Using the CSS variable by .setProperty()
// document.documentElement.style.setProperty('--color-primary', 'skyblue')

// // ----------------Attributes ---------------------

// const logo = document.querySelector('.nav__logo')
// console.log(logo.alt)
// console.log(logo.src)
// console.log(logo.className)

// // set attributes
// logo.alt = "Bankist's world's best logo ever"
// console.log(logo.alt)

// // Non-Standard
// console.log(logo.designer) // Wont work
// console.log(logo.getAttribute('designer'))
// logo.setAttribute('company', "Aman's Bankist")
// console.log(logo)

// const link = document.querySelector('.nav__link')

// // gives the absolute link
// console.log(link.href)
// // gives the link we provided
// console.log(link.getAttribute('href'))

// // Data Attributes
// console.log(logo.dataset.versionNumber) // for getting the data attributes

// // -----------------Classes ------------------
// // logo.classList.add()
// // logo.classList.remove()
// // logo.classList.toggle()
// // logo.classList.contains()

// const h1 = document.querySelector('h1')
// const alertH1 = function (e) {
//   alert('Clicked')
// }

// // 1. addEventListener()
// // h1.addEventListener('mouseenter', alertH1)

// // 2. onmouseenter -- Old school method(Dont use)
// // h1.onmouseenter = function (e) {
// //   alert('clicked once again')
// // }

// // 3. By using OnClick() in HTML -- Dont Use

// // RemoveEventListener
// // setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000)

// // ------------------Event Propagation----------------

// // random Int function
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min)

// // random Coloe
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`

// // ------------Bubbling------------

// // Note :1. e.target gives the element we clicked , so its gonna be same for all of them
// //       2. this/e.currentkeyword keyword gives us the element on which the eventListener is attached

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor()
//   console.log('LINK', e.target, e.currentTarget)

//   // To stop the event propagation
//   // e.stopPropagation()  -- Never use it!!

// })

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor()
//   console.log('Container', e.target, e.currentTarget)
// })

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor()
//   console.log('NAV', e.target, e.currentTarget)
// })

// ---------------- DOM Traversing ------------------------

// Going Upwards

// const h1 = document.querySelector('h1')

// console.log(h1.querySelectorAll('.highlight'))
// console.log(h1.childNodes)
// console.log(h1.children)
// h1.firstElementChild.style.color = 'white'
// h1.lastElementChild.style.color = 'black'

// // Going Downwards

// console.log(h1.parentNode)
// console.log(h1.parentElement)
// h1.closest('.header').style.background = 'orangered'

// // Going Sideways
// console.log(h1.previousSibling)
// console.log(h1.nextSibling)
// console.log(h1.previousElementSibling)
// console.log(h1.nextElementSibling)

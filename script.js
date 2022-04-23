'use strict'

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

const closeModal = function () {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal)

overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.getElementById('section--1')

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect()
  console.log(s1coords)
  section1.scrollIntoView({ behavior: 'smooth' })
})

////////////////////////
///////////////////////
//////////////////////
// Practice

// ----------------Selecting, Creating and Deleting -----------------

// ----------Selecting-------

console.log(document.documentElement) // Selects whole document
console.log(document.head) // Selects head of html
console.log(document.body) // Selects body

console.log(document.querySelector('.header'))

// Note : It returns a NODELIST
const sections = console.log(document.querySelectorAll('.section'))

document.getElementById('section--1')

// Note : Both returns a HTMLCollection
document.getElementsByTagName('button') // selects element by the html name
document.getElementsByClassName('btn') // selects element by the class

// ------Creating -----------

// insertAdjacentElement

// createElement()
const message = document.createElement('div')
message.classList.add('cookie-message')

message.innerHTML =
  'We use cookies in this website . <button class = "btn btn--close-cookie" >Got It!</button> '

const header = document.querySelector('.header')

// --------Inserting elements-----

// header.prepend(message) // Adds element to the first position of header
header.append(message) // Adds element to the last of header

// header.before(message) // Adds before the header
// header.after(message) // Adds after the header

// ------------Deleting ------------

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove() // deletes the element
    // message.parentElement.removeChild(message)
  })

// ----------- Styles ---------------

message.style.backgroundColor = '#37383d'
message.style.width = '120%'

// Note : getComputedStyle() gives the style of the CSS sheet
console.log(getComputedStyle(message).height)

// Adding height customly using the getComputedStyle()
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px'

// Using the CSS variable by .setProperty()
document.documentElement.style.setProperty('--color-primary', 'skyblue')

// ----------------Attributes ---------------------

const logo = document.querySelector('.nav__logo')
console.log(logo.alt)
console.log(logo.src)
console.log(logo.className)

// set attributes
logo.alt = "Bankist's world's best logo ever"
console.log(logo.alt)

// Non-Standard
console.log(logo.designer) // Wont work
console.log(logo.getAttribute('designer'))
logo.setAttribute('company', "Aman's Bankist")
console.log(logo)

const link = document.querySelector('.nav__link')

// gives the absolute link
console.log(link.href)
// gives the link we provided
console.log(link.getAttribute('href'))

// Data Attributes
console.log(logo.dataset.versionNumber) // for getting the data attributes

// -----------------Classes ------------------
// logo.classList.add()
// logo.classList.remove()
// logo.classList.toggle()
// logo.classList.contains()

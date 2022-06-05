'use strict'

const STORAGE_KEY = 'booksDB'
const MAX_PRICE = 70
const MIN_PRICE = 20
const BOOKS_TO_SHOW = 6
var gBooks = loadFromStorage(STORAGE_KEY)
gBooks ? gBooks : _createBooks()
var gPageIdx = 0
var gFilteredBooks
var gDescendTxt = false
var gDescendPrice = false

const gFilter = {
  maxPrice: MAX_PRICE,
  minRating: 0,
  txt: '',
}

function getBooks() {
  var books = gBooks.filter(
    (book) => book.price <= gFilter.maxPrice && book.rate >= gFilter.minRating
  )

  books = books.filter((book) => book.name.includes(gFilter.txt))
  gFilteredBooks = books.slice()
  const startIdx = gPageIdx * BOOKS_TO_SHOW
  if (startIdx >= books.length - BOOKS_TO_SHOW) {
    document.querySelector('.next-btn').disabled = true
  } else document.querySelector('.next-btn').disabled = false

  books = books.slice(startIdx, startIdx + BOOKS_TO_SHOW)

  return books
}

function getBooksToShow() {
  return BOOKS_TO_SHOW
}

function getAllBooks() {
  return gFilteredBooks
}

function getPageIdx() {
  return gPageIdx
}

function nextPage() {
  gPageIdx++
}

function pageChange(pageNum) {
  gPageIdx = +pageNum
}

function prevPage() {
  gPageIdx--
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex((book) => book.id === bookId)
  gBooks.splice(bookIdx, 1)
  _saveBookToStorage()
}

function addBook(elName, elPrice) {
  const newBook = _createBook(elName.value, +elPrice.value)
  gBooks.unshift(newBook)
  _saveBookToStorage()
  elName.value = ''
  elPrice.value = ''
}

function readBook(bookId) {
  const book = gBooks.find((book) => book.id === bookId)
  const elModal = document.querySelector('.book-modal')
  elModal.querySelector('h2').innerHTML = book.name
  elModal.querySelector('span').innerHTML = 'Price: ' + book.price + '$'
  elModal.querySelector('.add-btn').value = book.id
  elModal.querySelector('.sub-btn').value = book.id
  elModal.querySelector('.rate-input').value = book.rate
  elModal.querySelector('.book-img').src = book.imgUrl
}

function updateBookPrice(bookId, newPrice) {
  const book = gBooks.find((book) => book.id === bookId)
  book.price = newPrice
  _saveBookToStorage()
}

function addRating(bookId) {
  const book = gBooks.find((book) => book.id === bookId)
  if (book.rate >= 10) return
  book.rate++
  _saveBookToStorage()
  document.querySelector('.rate-input').value = book.rate
}

function subRating(bookId) {
  const book = gBooks.find((book) => book.id === bookId)
  if (book.rate <= 0) return
  book.rate--
  _saveBookToStorage()
  document.querySelector('.rate-input').value = book.rate
}

function setBookFilter(filterBy) {
  gPageIdx = 0
  if (filterBy.maxPrice !== undefined) gFilter.maxPrice = filterBy.maxPrice
  if (filterBy.minRating !== undefined) gFilter.minRating = filterBy.minRating
  if (filterBy.txt !== undefined) gFilter.txt = filterBy.txt
  return gFilter
}

function getIsDescendTxt() {
  return gDescendTxt
}

function getIsDescendPrice() {
  return gDescendPrice
}

function setTxtDescend(isDesc) {
  gDescendTxt = isDesc
}

function setPriceDescend(isDesc) {
  gDescendPrice = isDesc
}

function _createBook(name = 'default_book', price = 30) {
  return {
    id: makeId(),
    name,
    price,
    rate: 0,
    imgUrl: `imgs/books/${getRandomIntInclusive(1, 4)}.png`,
  }
}

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY)

  if (!books || !books.length) {
    books = []
    for (let i = 0; i < 32; i++) {
      const bookName = makeLorem(getRandomIntInclusive(2, 4))
      const price = +(
        getRandomIntInclusive(MIN_PRICE, MAX_PRICE) * Math.random()
      ).toFixed(2)
      books.push(_createBook(bookName, price))
    }
  }
  gBooks = books
  _saveBookToStorage()
}

function _saveBookToStorage() {
  saveToStorage(STORAGE_KEY, gBooks)
}

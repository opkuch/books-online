'use strict'

function onInit() {
  renderFilterByQueryStringParams()
  renderBooks()
  renderPages()
}

var gIsUpdate = {
  isUpdate: false,
  oldPrice: '',
}

function renderBooks() {
  var books = getBooks()
  var strHTMLs = books.map(
    (book) => `<tr>
    <td>${book.id}</td>
    <td>${book.name}</td>
    <td class="price price${book.id}">${book.price + '$'}</td>
    <td><button value="${
      book.id
    }" class="action read-btn" onclick="onReadBook(this.value)">Read</button></td>
    <td><button value="${
      book.id
    }" class="action update-btn" onclick="onUpdateBook(this)">Update</button></td>
    <td><button value="${
      book.id
    }" class="action delete-btn" onclick="onRemoveBook(this.value)">Delete</button></td>
</tr>
`
  )
  const elBooks = document.querySelector('.books-body')
  elBooks.innerHTML = strHTMLs.join('')
}

function renderPages() {

  //Render the right number of pages with regard to books amount

  var booksLength = getAllBooks().length
  const BOOKS_TO_SHOW = getBooksToShow()
  const pageAmount = Math.ceil(booksLength / BOOKS_TO_SHOW)
  const pageMap = []
  const elPageContainer = document.querySelector('.page-num-container')
  for (var i = 0; i < pageAmount; i++) {
    pageMap.push(i)
  }
  var strHTMLs = pageMap.map(
    (num) =>
      `<button class="page-btn page${num} ${
        !num ? 'clicked' : ''
      }" value="${num}" onclick="onPageChange(this)">${
        !num ? 1 : ++num
      }</button>`
  )
  elPageContainer.innerHTML = strHTMLs.join('')
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function onAddBook(ev) {
  ev.preventDefault()
  const bookName = document.querySelector('[name=create-name]')
  const price = document.querySelector('[name=create-price]')
  addBook(bookName, price)
  renderBooks()
  renderPages()
}

function onUpdateBook(updateBtn) {

  // Giving the option to change a book's price, 
  const bookId = updateBtn.value
  const elPrice = document.querySelector(`.price${bookId}`)
  const elUpdateBtns = document.querySelectorAll('.update-btn')
  if (gIsUpdate.isUpdate) {

      // Using the saved old price in global scope
    elPrice.innerHTML = gIsUpdate.oldPrice + '$'
    gIsUpdate.isUpdate = false
    for (var i = 0; i < elUpdateBtns.length; i++) {
      const elUpdateBtn = elUpdateBtns[i]
      elUpdateBtn.disabled = false
    }
  } else {

    // updates the old price
    gIsUpdate.oldPrice = elPrice.innerHTML.substring(
      0,
      elPrice.innerHTML.indexOf('$')
    )

    // Rendering price input
    elPrice.innerHTML = `<form class="update-price-form" onsubmit="onUpdatePrice(event)" ><input id="${bookId}" class="input-txt update-input update${bookId}" placeholder="New Price" name="update-price" autocomplete="off"/><button class="update-btn">&#10003</button></form>`
    gIsUpdate.isUpdate = true
    for (var i = 0; i < elUpdateBtns.length; i++) {

      // disabling the other update buttons,
      const elUpdateBtn = elUpdateBtns[i]
      elUpdateBtn.disabled = true
    }
    //Clicked button shouldn't be disabled
    updateBtn.disabled = false
  }
}

function onUpdatePrice(ev) {
  ev.preventDefault()
  //catching new price and relevant bookId
  const newPrice = document.querySelector('[name=update-price]').value
  if (!newPrice) newPrice = 0
  const bookId = document.querySelector('[name=update-price]').id
  //Updates model
  updateBookPrice(bookId, newPrice)
  gIsUpdate.isUpdate = false
  //Render
  renderBooks()
}

function onReadBook(bookId) {

  readBook(bookId)
  setQueryString(bookId)
  const elModal = document.querySelector('.book-modal')
  elModal.classList.add('active')
  
}

function onCloseModal() {
  document.querySelector('.book-modal').classList.remove('active')
  clearIdQueryParams()
}

function onAddRating(bookId) {
  addRating(bookId)
}

function onSubRating(bookId) {
  subRating(bookId)
}
function onNextPage() {

  //Remove clicked class from current page
  const pageNum = getPageIdx()
  const pageBtn = document.querySelector(`.page${pageNum}`)
  pageBtn.classList.remove('clicked')

  //Add clicked class to the next page
  const nxtPageBtn = document.querySelector(`.page${pageNum + 1}`)
  nxtPageBtn.classList.add('clicked')

  //Update gPageIdx and render 
  nextPage()
  renderBooks()
}

function onPrevPage() {
  const pageNum = getPageIdx()
  if (pageNum === 0) return
  const pageBtn = document.querySelector(`.page${pageNum}`)
  pageBtn.classList.remove('clicked')
  const nxtPageBtn = document.querySelector(`.page${pageNum - 1}`)
  nxtPageBtn.classList.add('clicked')
  prevPage()
  renderBooks()
}

function onSortByTitle() {
  sortByTxt()
  renderBooks()
}

function onSortByPrice() {
  sortByNum()
  renderBooks()
}

function onPageChange(pageBtn) {
  const pageBtns = document.querySelectorAll('.page-btn')
  for (var i = 0; i < pageBtns.length; i++) {
    const btn = pageBtns[i]
    btn.classList.remove('clicked')
  }
  const pageNum = pageBtn.value
  pageChange(pageNum)
  pageBtn.classList.add('clicked')
  renderBooks()
}

function clearIdQueryParams() {
  var newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    window.location.search

  newUrl = newUrl.slice(0, newUrl.indexOf('id='))
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function setQueryString(bookId) {
  const oldQueryString = new URLSearchParams(window.location.search)
  const queryStringParams = `?maxPrice=${oldQueryString.get(
    'maxPrice'
  )}&minRating=${oldQueryString.get('minRating')}&id=${bookId}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
  // Retrieve data from the current query-params
  const queryStringParams = new URLSearchParams(window.location.search)
  const filterBy = {
    maxPrice: +queryStringParams.get('maxPrice') || 70,
    minRating: +queryStringParams.get('minRating') || 0,
  }
  const bookId = queryStringParams.get('id') || ''
  if (bookId) onReadBook(bookId)

  if (filterBy.maxPrice === MAX_PRICE && !filterBy.minRating) return
  document.querySelector('.filter-price-range').value = +filterBy.maxPrice
  document.querySelector('.filter-rating-range').value = +filterBy.minRating
  setBookFilter(filterBy)
}
function onSetFilterBy(filterBy) {
  filterBy = setBookFilter(filterBy)
  renderBooks()
  renderPages()
  const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRating=${filterBy.minRating}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function onCreateBook() {
  document.querySelector('.create-books form').classList.toggle('active')
}

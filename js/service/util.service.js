'use strict'

function makeId(length = 6) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var txt = ''
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function makeLorem(wordCount = 100) {
  const words = [
    'The sky',
    'above',
    'the port',
    'was',
    'the color of television',
    'tuned',
    'to',
    'a dead channel',
    'All',
    'this happened',
    'more or less',
    'I',
    'had',
    'the story',
    'bit by bit',
    'from various people',
    'as generally',
    'happens',
    'in such cases',
    'each time',
    'it',
    'was',
    'a different story',
    'It',
    'was',
    'a pleasure',
    'to',
    'burn',
  ]
  var txt = ''
  while (wordCount > 0) {
    wordCount--
    txt += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return txt
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function sortByTxt() {
  var isDesc = getIsDescendTxt()
  if (!isDesc) {
    gBooks.sort((book1, book2) => book1.name.localeCompare(book2.name))
    setTxtDescend(true)
  } else {
    gBooks.sort((book1, book2) => book2.name.localeCompare(book1.name))
    setTxtDescend(false)
  }
}

function sortByNum() {
  var isDesc = getIsDescendPrice()
  if (!isDesc) {
    gBooks.sort((book1, book2) => book1.price - book2.price)
    setPriceDescend(true)
  } else {
    gBooks.sort((book1, book2) => book2.price - book1.price)
    setPriceDescend(false)
  }
}

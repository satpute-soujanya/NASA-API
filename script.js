const resultNav = document.getElementById('resultNav')
const favoriteNav = document.getElementById('favoriteNav')
const imageContainer = document.querySelector('.images_container')
const saveConfirmed = document.querySelector('.save_confirmed')
const loader = document.querySelector('.loader')

// Nasa API URL
const apiKey = `hvPMRMd8P2aKJTsB1OkEjuSu20nb2vAth5jusopA`
const count = 10
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`
let resultArray = []
let favourites = {}
// Show Content
function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' })
  if (page === 'results') {
    resultNav.classList.remove('hidden')
    favoriteNav.classList.add('hidden')
  } else {
    resultNav.classList.add('hidden')
    favoriteNav.classList.remove('hidden')
  }
  loader.classList.add('hidden')
}
// Update DOM funtion
function createDOMNode(page) {
  const currentArray =
    page === 'results' ? resultArray : Object.values(favourites)
  // console.log(currentArray)

  currentArray.forEach((result) => {
    // Card
    const card = document.createElement('div')
    card.classList.add('card')
    // Link
    const imageLink = document.createElement('a')
    imageLink.href = result.hdurl
    imageLink.title = 'View Full Image'
    imageLink.target = '_blank'

    // Image
    const image = document.createElement('img')
    image.src = result.url
    image.title = 'Nasa picture of the Day'
    image.loading = 'lazy'
    image.classList.add('card_img_top')
    // CardBody
    const cardBody = document.createElement('div')
    cardBody.classList.add('card_body')
    // Card list
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add('card_title')
    cardTitle.textContent = result.title
    // Add to favourites
    const addToFav = document.createElement('p')
    addToFav.classList.add('clickable')
    page === 'results'
      ? (addToFav.textContent = 'Add to favourites')
      : (addToFav.textContent = 'Remove favourites')
    page === 'results'
      ? addToFav.setAttribute('onClick', `saveFavourite('${result.url}')`)
      : addToFav.setAttribute('onClick', `removeFavourite('${result.url}')`)

    // Explanation
    const cardText = document.createElement('p')
    cardText.classList.add('card_text')
    cardText.textContent = result.explanation
    // Footer
    const footerContainer = document.createElement('small')
    footerContainer.classList.add('text_muted')
    // Date
    const date = document.createElement('strong')
    date.textContent = result.date

    // copywrite
    const copyWrite = document.createElement('span')
    const copyWriteResult =
      result.copyright == undefined ? '' : result.copyright
    copyWrite.textContent = `${copyWriteResult}`

    // Append
    footerContainer.append(date, copyWrite)
    cardBody.append(cardTitle, addToFav, cardText, footerContainer)
    imageLink.append(image)
    card.append(imageLink, cardBody)
    imageContainer.append(card)
  })
}
function updateImagesToDOM(page) {
  // Get users data from local storage
  if (localStorage.getItem('NasaFav')) {
    favourites = JSON.parse(localStorage.getItem('NasaFav'))
  }
  imageContainer.textContent = ''
  createDOMNode(page)
  showContent(page)
}

// Get 10 Images from nasa API

async function getNasaImages() {
  // Show Loader
  loader.classList.remove('hidden')

  try {
    const response = await fetch(apiUrl)
    resultArray = await response.json()
    updateImagesToDOM('results')
  } catch (error) {
    console.log(error)
  }
}

function saveFavourite(itemUrl) {
  resultArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
      favourites[itemUrl] = item
      //   save confirmation
      saveConfirmed.hidden = false
      setTimeout(() => {
        saveConfirmed.hidden = true
      }, 2000)
      //   Localstorage
      localStorage.setItem('NasaFav', JSON.stringify(favourites))
    }
  })
}
function removeFavourite(itemUrl) {
  if (favourites[itemUrl]) {
    delete favourites[itemUrl]
    localStorage.setItem('NasaFav', JSON.stringify(favourites))
    updateImagesToDOM('favourites')
  }
}

getNasaImages()

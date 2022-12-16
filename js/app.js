import Router from './Router.js'
import { renderNotFound } from './sites.js'

const main = document.querySelector('#main')

let memeTemplates = []

fetchTemplates()

function fetchTemplates() {
  fetch('https://api.imgflip.com/get_memes')
    .then((res) => res.json())
    .then((data) => {
      memeTemplates = data.data.memes.filter((meme) => meme.box_count == 2)

      const routes = createRoutes(memeTemplates)
      const router = new Router(routes)
      router.urlResolve()
    })
}

function displayTemplates() {
  memeTemplates.forEach((template) => {
    const div = document.createElement('div')
    div.classList.add('meme')
    div.innerHTML = `<img src="${template.url}" alt="${template.name}">`

    div.addEventListener('click', () => {
      location.hash = `#${formatTemplateName(template.name)}`
    })

    main.append(div)
  })
}

function renderHome() {
  clearElement(main)
  displayTemplates()
}

function createRoutes(arr) {
  const routes = {
    home: {
      hash: '#home',
      function: renderHome,
    },
    error: {
      function: renderNotFound,
    },
  }

  arr.forEach((meme) => {
    routes[`${formatTemplateName(meme.name)}`] = {
      hash: `#${formatTemplateName(meme.name)}`,
      function: () => {
        clearElement(main)
        main.innerHTML = `
          <div class="create-meme">
            <img src="${meme.url}" alt="${meme.name}">
            <form class="create-meme-form">
              <input type="text" name="top" placeholder="Top Text" />
              <input type="text" name="bottom" placeholder="Bottom Text" />
              <button type="submit">Create Meme</button>
            </form>
            <a href="#home">Back</a>
          </div>
        `
        document
          .querySelector('.create-meme-form')
          .addEventListener('submit', async (e) => {
            e.preventDefault()

            const formData = new FormData(e.target)

            const topText = formData.get('top')
            const bottomText = formData.get('bottom')

            const params = {
              template_id: meme.id,
              text0: topText,
              text1: bottomText,
            }

            const res = await fetch(
              `https://api.imgflip.com/caption_image?template_id=${params.template_id}&username=thesolian&password=Legs0505&text0=${params.text0}&text1=${params.text1}&font=impact`,
              {
                method: 'POST',
              }
            )
            const data = await res.json()
            console.log(data)

            document.querySelector('.create-meme').innerHTML = `
              <div class="meme-created-controls">
                <img src="${data.data.url}" alt="${meme.name}">
                <a href="#home">Create another</a>
                <p>To download rightclick on image and click "Save image"</p>
              </div>
            `
          })
      },
    }
  })

  return routes
}

function formatTemplateName(name) {
  return name.toLowerCase().replace(/ /g, '-')
}

function clearElement(element) {
  element.innerHTML = ''
}

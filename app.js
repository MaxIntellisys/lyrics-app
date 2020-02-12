class Model {
    constructor() {
        this.baseURL = 'https://api.lyrics.ovh';
    }
    /**
     * Fetches 15 songs related to a given term
     * @param {string} term search term to look for
     * @returns array of objects with the song info
     * @memberof Model
     */
    async searchSongs(term) {
        const res = await fetch(`${this.baseURL}/suggest/${term}`)
        const data = await res.json()

        return data.data
    }
    /**
     * Fetches the lyrics for a song
     * @param {string} artist artist name
     * @param {string} songTitle name of the song
     * @returns the lyrics for a song
     * @memberof Model 
     */
    async getLyrics(artist, songTitle) {
        const res = await fetch(`${this.baseURL}/v1/${artist}/${songTitle}`);
        const data = await res.json()

        return data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    }

}


class View {
    /**
     * Creates an instance of View.
     * Setup and renders the initial elements.
     * @memberof View
     */
    constructor() {
        this.app = this.getElement('#app')

        this.title = this.create('h1')
        this.title.innerText = 'Lyrics App'

        this.subTitle = this.create('h3')
        this.subTitle.innerText = 'Worlds Music in your hands 👐'

        this.search = this.create('input', 'search')
        this.search.type = 'text'
        this.search.placeholder = 'Search lyrics...'

        this.searchBtn = this.create('button', 'search-btn')
        this.searchBtn.innerText = '🔍'

        this.form = this.create('div', 'form')
        this.form.append(this.search, this.searchBtn)

        this.header = this.create('header', 'header')
        this.header.append(this.title, this.subTitle, this.form)

        this.results = this.create('results', 'results')


        this.app.append(this.header, this.results)
    }
    /**
     * Grabs an element with a matching selector
     * @param {string} selector css selector like a tag, .class or #id
     * @returns the matching element
     * @memberof View
     */
    getElement(selector) {
        const element = document.querySelector(selector)
        return element
    }
    /**
     * Creates an HTML element
     * @param {string} tag html tag name
     * @param {string} classname class name (optional)
     * @returns newly created element
     * @memberof View
     */
    create(tag, classname) {
        const element = document.createElement(tag)
        if (classname) { element.classList.add(classname) }
        return element
    }
    /**
     * Creates a component with multiple elements for each song that the array has.
     * @param {string} songs an array of objects with the songs info
     * @memberof View
     */
    createSongsList(songs) {
        songs.forEach((song) => {
            const li = this.create('li', 'song')
            li.setAttribute('data-title', `${song.title}`)
            li.setAttribute('data-artist', `${song.artist.name}`)

            const span = this.create('span')
            span.textContent = `${song.artist.name} - ${song.title}`

            const button = this.create('button', 'view-btn')
            button.textContent = 'view lyrics'
            li.append(span, button)

            this.results.append(li)
        })
    }

}

class Controller {
    /**
     * Creates an instance of Controller
     * which integrates data into elements and listen for DOM events
     * @param {class} model contains all the data for the app
     * @param {class} view handles creation and manipulation of the DOM elements
     * @memberof Controller
     */
    constructor(model, view) {
        this.model = model
        this.view = view

        this.view.searchBtn.addEventListener('click', async () => {
            let term = this.view.search
            if (!term.value) { alert('Please enter a search term!') }


            const songs = await this.model.searchSongs(term.value.trim())
            this.view.results.innerText = ''
            this.view.createSongsList(songs)
            term.value = ''

            const btns = document.querySelectorAll('.view-btn')
            btns.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const songTitle = btn.parentElement.dataset.title
                    const artist = btn.parentElement.dataset.artist

                    const lyrics = await this.model.getLyrics(artist, songTitle)
                    this.view.results.innerHTML = lyrics
                })
            })
        })
    }

}

const app = new Controller(new Model(), new View())
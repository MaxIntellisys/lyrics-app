class Model {
    constructor() {
        this.baseURL = 'https://api.lyrics.ovh';
    }

    async searchSongs(term) {
        const res = await fetch(`${this.baseURL}/suggest/${term}`)
        const data = await res.json()

        return data.data
    }

    async getLyrics(artist, songTitle) {
        const res = await fetch(`${this.baseURL}/v1/${artist}/${songTitle}`);
        const data = await res.json()

        return data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    }

}


class View {
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

    getElement(selector) {
        const element = document.querySelector(selector)
        return element
    }

    create(tag, classname) {
        const element = document.createElement(tag)
        if (classname) { element.classList.add(classname) }
        return element
    }

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
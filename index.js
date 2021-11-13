const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

const newspapers = [
    {
        name: 'noticiasdomar',
        address: 'https://www.noticiasdomar.pt/index.php/mais/economia-do-mar',
        base: 'https://www.noticiasdomar.pt'
    },
    {
        name: 'euronews',
        address: 'https://pt.euronews.com/tag/mar',
        base: 'https://pt.euronews.com'
    },
    {
        name: 'diariodenoticias',
        address: 'https://www.dn.pt/tag/mar.html',
        base: 'https://www.dn.pt'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("mar")', html).each(function () {
                const tittle = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    tittle,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})


app.get('/', (req, res) => {
    res.json('Bem-vindo à minha API sobre notícias do Mar')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("mar")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    tittle,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})

app.listen(PORT, () => console.log(`Servidor a funcionar na PORTA ${PORT}`))


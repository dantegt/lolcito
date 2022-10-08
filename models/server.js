const express = require('express')
const cors = require('cors')
const { error } = require('../controllers/champions')
const expressSanitizer = require('express-sanitizer')

class Server {
    constructor() {
        this.app = express()
        this.middleware()
        this.router()
        this.port = process.env.PORT || 8080
        this.api = process.env.API_KEY
    }

    middleware() {
        this.app.use(cors())
        // Reemplaza la ruta raiz por el contenido de la carpeta public
        this.app.use(express.static('public'))
        this.app.use(expressSanitizer());
    }

    router() {
        this.app.get('/entrega', (req, res) => res.redirect(301, '/condiciones-entrega-api.pdf'))
        this.app.get('/api', (req, res) => res.redirect(301, 'https://documenter.getpostman.com/view/23525710/2s83S87WAK'))
        this.app.use('/api/v1', require('../routes/champions'))

        this.app.all('*', (req, res) => {
            res.status(404).json(error(404, `Page not found`))
        })
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server
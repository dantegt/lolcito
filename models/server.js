const express = require('express')
const cors = require('cors')
const expressSanitizer = require('express-sanitizer');

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
        this.app.use('/api/v1', require('../routes/champions'))

        this.app.all('*', (req, res) => {
            res.send('Página no encontrada')
        })
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server
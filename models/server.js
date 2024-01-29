const express = require('express')
const cors = require('cors')
const { error } = require('../controllers/champions')
const expressSanitizer = require('express-sanitizer')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Lolcito - Express API with Swagger",
        version: "0.1.0",
        description:
          "Api League of Legends",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Dante Pereyra ",
          url: "https://github.com/dantegt",
          email: "pereyradan@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:8080/api/v1",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
const specs = swaggerJsDoc(options);

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
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs,{ explorer: true }))

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
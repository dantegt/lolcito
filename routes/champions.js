const { Router } = require("express");
const {
    getDocs,
    getAPI,
    getChampions,
    getChampion,
    findChampion,
    getSummoner,
    getCondiciones,
} = require("../controllers/champions");

const router = new Router()

// VI. Los endpoint deben estar creados como una colección en postman y correctamente documentados.
// a) Listado de registros que muestre 50 o más registros
// b) Visualización de un registro en particular (param id)
// c) Listado de registros que pueda filtrarse a través de query params.
// EXTRA: Uso de un API con API key

router.get('/', getDocs)
router.get('/api', getAPI)
router.get('/entrega', getCondiciones)
router.get('/champion/find', findChampion)
router.get('/champion/:id', getChampion)
router.get('/champion', getChampions)
router.get('/summoner/:id', getSummoner)

module.exports = router
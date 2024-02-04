/**
 * @swagger
 * components:
 *   schemas:
 *     Champion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the Champion (name with no special characters)
 *         name:
 *           type: string
 *           description: The name of the Champion
 *         type:
 *           type: string
 *           description: The type of Champion
 *       example:
 *         id: Khazix
 *         name: Kha'Zix
 *         type: Assassin
 *     ChampionList:
 *       type: object
 *       properties:
 *         version:
 *           type: string
 *           description: The id of  (name with no special characters)
 *         data:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Champion'
 *           description: The list of Champion
 *         type:
 *           type: string
 *           description: The type of Champion
 *       example:
 *         version: 14.2.1
 *         data: [{ id: "103", name: "Ahri", tags: ["Assassin"]}]
 *     Summoner:
 *       type: object
 *       properties:
 *         summoner:
 *           type: object
 *           description: Summoner data
 *           $ref: '#/components/schemas/SummonerData'
 *     SummonerData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Summoner id
 *         accountId:
 *           type: string
 *           description: Summoner accountId
 *         puuid:
 *           type: string
 *           description: Summoner puuid
 *         name:
 *           type: string
 *           description: Summoner name
 *         profileIconId:
 *           type: integer
 *           description: Summoner profileIconId
 *         revisionDate:
 *           type: integer
 *           description: Summoner revisionDate
 *         summonerLevel:
 *           type: integer
 *           description: Summoner summonerLevel 
 * tags:
 *   name: Champion
 *   description: Champions API
 * /champion:
 *   get:
 *      summary: Obtener todos los campeones
 *      tags: [Champion]
 *      responses:
 *       200:
 *         description: Listado de campeones.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Champion'
 *       500:
 *         description: Server error
 * /champion/{id}:
 *   get:
 *     summary: Encontrar un campeón por id (número)
 *     tags: [Champion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Champion id
 *     responses:
 *       200:
 *         description: The champion response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Champion'
 *       404:
 *         description: The book was not found
 * /champion/find:
 *   get:
 *     summary: Buscar un campeón por id (numero), name o type
 *     tags: [Champion]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: Champion id
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Champion name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Champion type
 *     responses:
 *       200:
 *         description: Campeones que coicidan con todos los parámetros del request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Champion'
 *       500:
 *         description: Some server error
 * /summoner/{server}/{id}:
 *   get:
 *     summary: Encontrar datos de un Summoner (require un api_key actualizado)
 *     tags: [Summoner]
 *     parameters:
 *       - in: path
 *         name: server
 *         schema:
 *           type: string
 *           enum: [br1,eun1,euw1,jp1,kr,la1,la2,na1,oc1,ph2,ru,sg2,th2,tr1,tw2,vn2]
 *         required: true
 *         description: El server de Riot
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id de Summoner (nombre de invocador)
 *     responses:
 *       200:
 *         description: Summoner encontrado
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Summoner'
 *       404:
 *         description: The summoner was not found
 * /api_key/{api_key}:
 *   put:
 *     summary: Actualizar api_key
 *     tags: [API]
 *     parameters:
 *       - in: path
 *         name: api_key
 *         schema:
 *           type: string
 *         required: true
 *         description: api_key
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: Password
 *     responses:
 *       200:
 *         description: Api key was updated
 *       400:
 *         description: Bad Request
 */

const { Router } = require("express");
const {
    getDocs,
    getChampions,
    getChampion,
    findChampion,
    getSummoner,
    setApiKey,
} = require("../controllers/champions");

const router = new Router()

// VI. Los endpoint deben estar creados como una colección en postman y correctamente documentados.
// a) Listado de registros que muestre 50 o más registros
// b) Visualización de un registro en particular (param id)
// c) Listado de registros que pueda filtrarse a través de query params.
// EXTRA: Uso de un API con API key

router.get('/', getDocs)
router.get('/champion/find', findChampion)
router.get('/champion/:id', getChampion)
router.get('/champion', getChampions)
router.get('/summoner/:server/:id', getSummoner)
router.put('/api_key/:api_key', setApiKey)

module.exports = router
const axios = require('axios').default
const api = process.env.API_KEY

const getDocs = (req, res) => {
    res.send('Documentacion de API')
}

const getChampions = (req, res) => {
    // Listado de Campeones
    axios.get(`http://ddragon.leagueoflegends.com/cdn/12.17.1/data/es_AR/champion.json`)
    .then((resp) => {
        res.status(200).json(resp.data)
    })
    .catch((err) => {
        res.send(`Error: ${err}`)
    })
}

const getChampion = (req, res) => {
    // Obtener un Campeon por id
    const {id} = req.params
    const sId = req.sanitize(id)
 
    axios.get(`http://ddragon.leagueoflegends.com/cdn/12.17.1/data/es_AR/champion.json`)
    .then((resp) => {
        const champs = Object.entries(resp.data.data)
            .map(([name, champ]) => champ)
            .filter((champ) => champ.key == sId)
        res.status(200).json(champs)
    })
    .catch((err) => {
        res.send(`Error: ${err}`)
    })
}

const findChampion = (req, res) => {
    // Encontrar un Campeon
    let {id, name, type} = req.query
    id = req.sanitize(id)
    name = req.sanitize(name)
    type = req.sanitize(type)
  
    axios.get(`http://ddragon.leagueoflegends.com/cdn/12.17.1/data/es_AR/champion.json`)
    .then((resp) => {
        let champs = Object.entries(resp.data.data)
            .map(([name, champ]) => champ)
        
        if(id)
            champs = champs.filter((champ) => champ.key == id)
        if(name)
            champs = champs.filter((champ) => champ.id.toLowerCase().includes(name.toLowerCase()))
        if(type)
            champs = champs.filter((champ) => champ.tags.join().toLowerCase().includes(type.toLowerCase()))

        res.status(200).json(champs)
    })
    .catch((err) => {
        res.send(`Error: ${err}`)
    })
}

const getSummoner = (req, res) => {
    const {id} = req.params
    const {api_key} = req.query
    const key = req.sanitize(api_key) || api

    axios.get(`https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${id}?api_key=${key}`)
    .then((resp) => {
        res.status(200).json({ summoner: resp.data })
    })
    .catch((err) => {
        res.send(`Error: ${err}`)
    })
}
    
module.exports = {
    getDocs,
    getChampions,
    getChampion,
    findChampion,
    getSummoner,
}
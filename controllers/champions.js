const axios = require('axios').default
let api = process.env.API_KEY
const secret = process.env.SECRET
const version = process.env.VERSION || '13.24.1'
const NodeCache = require("node-cache")
const apiCache = new NodeCache()

const getDocs = (req, res) => {
    res.send('Documentacion de API')
}

const getChampions = (req, res) => {
    const latestVersion = apiCache.get('latestVersion') || version

    const champions = apiCache.get('champions')
    if (champions) {
        console.log('getChampions from cache!')
        res.status(200).json(champions)
        return
    }

    // Listado de Campeones
    axios.get(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_AR/champion.json`)
    .then((resp) => {
        res.status(200).json(resp.data)
    })
    .catch((err) => {
        res.status(400).json(error(400, `Bad Request ${err}`))
    })
}

const getChampion = (req, res) => {
    // Obtener un Campeon por id
    const latestVersion = apiCache.get('latestVersion') || version
    const {id} = req.params
    const sId = req.sanitize(id)

    const mapChampions = (data) => Object.entries(data)
            .map(([name, champ]) => champ)
            .filter((champ) => champ.key == sId)

    const responses = (resp) => {
        const champs = mapChampions(resp)
        if(!champs.length) res.status(404).json(error(404, `Champion not found`))
        res.status(200).json(champs[0])
    }

    // Response from cache
    const champions = apiCache.get('champions')
    if (champions) {
        console.log('getChampion from cache! Champion id ', id)
        responses(champions)
        return
    }
    
    // Response from web
    axios.get(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_AR/champion.json`)
    .then((resp) => {
        responses(resp.data.data)
    })
    .catch((err) => {
        res.status(400).json(error(400, `Bad Request ${err}`))
    })
}

const findChampion = (req, res) => {
    // Encontrar un Campeon
    const latestVersion = apiCache.get('latestVersion') || version
    let {id, name, type, ...others} = req.query
    id = req.sanitize(id)
    name = req.sanitize(name)
    type = req.sanitize(type)

    const mapChampions = (champions) => {
        let champs = Object.entries(champions)
            .map(([name, champ]) => champ)
        
        if(id)
            champs = champs.filter((champ) => champ.key == id)
        if(name)
            champs = champs.filter((champ) => (champ.id.toLowerCase()).includes(name.toLowerCase()))
        if(type)
            champs = champs.filter((champ) => champ.tags.join().toLowerCase().includes(type.toLowerCase()))
        if(id || name || type) {
            res.status(200).json(champs)
        } else {
            res.status(400).json(error(400, `Bad Request - ${Object.keys(others)} not found`))
        }    
    }

    const champions = apiCache.get('champions')
    if (champions) {
        console.log('findChampion from cache! Champion id ', id, name, type)
        mapChampions(champions)
        return
    }
  
    axios.get(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_AR/champion.json`)
    .then((resp) => {
          mapChampions(resp.data.data)
    })
    .catch((err) => {
        res.status(400).json(error(400, `Bad Request ${err}`))
    })
}

const getSummoner = (req, res) => {
    const {server, id} = req.params

    axios.get(`https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${id}?api_key=${api}`)
    .then((resp) => {
        res.status(200).json(resp.data)
    })
    .catch((err) => {
        res.status(400).json(error(400, `Bad Request ${err}`))
    })
}

const getMasteries = (req, res) => {
    const {server, puuid} = req.params

    const champions = apiCache.get('champions')
    if(!champions) res.status(400).json(error(400, `Bad Request ${err}`))

    axios.get(`https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${api}`)
    .then((resp) => {
        const masteries = champions.map((champion) => {
            const {chestGranted, ...mastery} =
                resp.data.find((m) => m.championId.toString() === champion.key) ||
                fallbackMastery(puuid, parseInt(champion.key))

            return ({
                ...champion,
                chestGranted,
                mastery,               
            })
        })
        res.status(200).json(masteries)
    })
    .catch((err) => {
        res.status(400).json(error(400, `Bad Request ${err}`))
    })
}

const fallbackMastery = (puuid = "puuid", championId = 0) => ({
    "puuid": puuid,
    "championId": championId,
    "championLevel": 0,
    "championPoints": 0,
    "lastPlayTime": 0,
    "championPointsSinceLastLevel": 0,
    "championPointsUntilNextLevel": 0,
    "chestGranted": false,
    "tokensEarned": 0,
    "summonerId": "summonerId"
    })

const setApiKey = (req, res) => {
    const {api_key} = req.params
    const {password} = req.query
    const key = req.sanitize(api_key)
    const pass = req.sanitize(password)

    if(key && pass && pass === secret) {
        api = key
        res.status(200).json({ api_key: key })
    } else {
        res.status(400).json(error(400, `Bad Request`))
    }
}

const error = (status, error) => ({
    status: status,
    error: error,
})

const setChampionsCache = async () => {
    
    //Set latest version to cache
    await axios.get(`https://ddragon.leagueoflegends.com/api/versions.json`)
    .then((resp) => {
        apiCache.set('latestVersion', resp.data[0])
    })
    .catch((err) => {
        console.log(err)
    })

    const latestVersion = apiCache.get('latestVersion')
    console.log('latestVersion', latestVersion)

    // Set champions list to cache
    await axios.get(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/es_AR/champion.json`)
    .then((resp) => {
        const champs = Object.values(resp.data.data).map(({version, info, blurb, stats, ...champion}) => (champion))
        apiCache.set('champions', champs)
    })
    .catch((err) => {
        console.log(err)
    })

}
    
module.exports = {
    getDocs,
    getChampions,
    getChampion,
    findChampion,
    getSummoner,
    getMasteries,
    setApiKey,
    error,
    setChampionsCache,
}
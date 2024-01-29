# API Express.js

API en Express.js que consume el API de RIOT Games para consultar sobre nombres de invocador (/summoner) o información de campeones (/champion).

[Condiciones de Entrega](condiciones-entrega-api.pdf)

[Heroku - tup-lolcito](https://lolcito-express.onrender.com/)

## Para empezar

La version actual del api es `/api/v1`

Los endpoints `/champion` son libres y se puede consultar sin registro.

Para la consulta del endpoint `/summoner` hay que obtener un API_KEY de 24hs de duracion en [Riot Developer Portal](https://developer.riotgames.com/) y configurarlo en el archivo .env o a través del endpoint Swagger `/api/v1/api_key/{api_key}` junto con el password

### Obtener un API key

Es muy fácil.
- Registrarse en [Riot Developer Portal](https://developer.riotgames.com/)
- Aceptar los terminos de servicio
- Copiar el Development API key
- Actualizarla en archivo .env o Swagger

### Swagger

Todos los endpoints se documentaron en [Swagger - Open API 3.1](/swagger)

### Documentacion Postman

[API Postman docs](https://documenter.getpostman.com/view/23525710/2s83S87WAK)

[Share link para cargarlo en Postman](https://www.postman.com/telecoms-astronaut-80158309/workspace/workspace/collection/23525710-03d26889-1345-4e83-989f-7a6d517bac4a?action=share&creator=23525710)

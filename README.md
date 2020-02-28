## Painikepeli

Painikepeli on moninpeli jossa tavoite on kerätä mahdollisimman paljon pisteitä. Peliä voi pelata täällä: https://festive-shannon-a3b1c5.netlify.com/

Selainsovellus on tehty Reactilla käyttäen Socket.io kirjastoa sekä express.js, Node.js kehitysympäristöjä.

## Kuinka asennat pelin

Vaaditaan: Node.js https://nodejs.org/en/

Sovellus koostuu kahdesta osasta: käyttöliittymästä ja palvelimesta. Aja komennot clientille ja serverille niiden kansioissa:

### `npm install`

### `npm start`

Avaa http://localhost:3000 osoite.


Palvelin on julkisesti saatavilla pilvipalvelussa: https://painikepeli-hannes.herokuapp.com/
Palvelimen osoitteen voi vaihtaa muuttamalla ENDPOINT muuttujaa tiedostosta \client\src\components\Game\Game.js

const ENDPOINT = 'localhost:5000';

Oletuksena arvo on localhost:5000.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

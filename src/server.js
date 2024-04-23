//Importér Express-modulet
const express = require('express');
const cors = require('cors');
const { connectToDatabase, closeDatabaseConnection} = require('./modules/database');
const { hashPassword } = require('./modules/password-hasher');
const { validatePassword } = require('./modules/password-validator');
const { generateMFACode, verifyMFACode  } = require('./modules/mfa');
const { createSession, getSession, deleteSession } = require('./modules/session');
const { setCookie, getCookie } = require('./modules/cookies');

//Opret en Express-app
const app = express();
app.use(cors());
const port = 3000;

app.post('/login', (req, res) => {
    //Implementer login her
});
  
//Endpoint for registrering
app.post('/register', (req, res) => {
    const { username, password } = req.body;
});
  
//Endpoint for læsning af kurser
app.get('/courses', (req, res) => {
    //Hent førstehjælpskurser
});
  
//Endpoint for indsættelse af kursus
app.post('/courses', (req, res) => {
    //tilføj førstehjælpskurser
});

//Start serveren
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});

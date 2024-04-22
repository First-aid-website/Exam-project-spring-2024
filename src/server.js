//Importér Express-modulet
const express = require('express');

//Opret en Express-app
const app = express();

app.post('/login', (req, res) => {
    //Implementer login her
});
  
//Endpoint for registrering
app.post('/register', (req, res) => {
    //Implementer registrering her
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

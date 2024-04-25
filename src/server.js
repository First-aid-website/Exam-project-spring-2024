//Importér Express-modulet
const express = require('express');
const cors = require('cors');
const { connectToDatabase, closeDatabaseConnection, insertUser } = require('./modules/database');
const { hashPassword } = require('./modules/password-hasher');
const { validatePassword } = require('./modules/password-validator');
const { generateMFACode, verifyMFACode  } = require('./modules/mfa');
const { createSession, getSession, deleteSession } = require('./modules/session');
const { setCookie, getCookie } = require('./modules/cookies');

//Opret en Express-app
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies
const port = 3000;

app.post('/login', (req, res) => {
    //Implementer login her
});
  
//Endpoint for registrering
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try{
        const passwordValidation = validatePassword(password);
        const passwordHash = hashPassword(password);

        if (!passwordValidation.isValid) {
            return res.status(400).json({ error: passwordValidation.message });
        }
        
        const user = {
            username: username,
            password: (await passwordHash).toString()
        };

        // await connectToDatabase();
        await insertUser(user);
        await closeDatabaseConnection();

        res.status(201).json({ message: 'Brugeren oprettet' }); // Return a success message
    }
    catch(error){
        console.error('Error during registration of user: ', error);
        res.status(500).json({ error: 'Der opstod en fejl under registrering af bruger.' });
    }
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

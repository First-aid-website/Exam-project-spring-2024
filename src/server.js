//Importér Express-modulet
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const { connectToDatabase, closeDatabaseConnection, insertUser, findUser } = require('./modules/database');
const { hashPassword } = require('./modules/password-hasher');
const { validatePassword } = require('./modules/password-validator');
const { generateMFACode, verifyMFACode  } = require('./modules/mfa');
const { createSession, getSession, deleteSession } = require('./modules/session');
const { setCookie, getCookie } = require('./modules/cookies');

//Opret en Express-app
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); //Til redirects
const port = 3000;

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await findUser(username);

        console.log('User:', user);

        // Check om brugeren har aktiveret MFA
        if (user.mfaEnabled) {
            // Valider MFA-koden
            const isMfaValid = verifyMFACode(user.mfaSecret, mfaCode);
            if (!isMfaValid) {
                return res.status(401).json({ error: 'MFA-koden er forkert.' });
            }
        }

        if(!user){
            return res.status(401).json({ error: 'Brugernavn eller password er forkert.' })
        }
        const hashedPasswordFromDB = user.password; // Det hashede password fra databasen
        // Sammenlign det hashede password fra databasen med det, der blev sendt i login-forespørgslen
        const isPasswordValid = await bcrypt.compare(password, hashedPasswordFromDB);
        if (isPasswordValid) {
            // Password matcher
            const sessionId = createSession(user._id); // Brug userId fra user objektet
            // Redirect brugeren til index.html i public-mappen
            return res.status(200).json({ redirectUrl: '/public/index.html' });
        } else {
            // Password matcher ikke
            return res.status(401).json({ error: 'Brugernavn eller password er forkert.' });
        }
    }
    catch(error){
        console.error('Error when user attempted to login: ', error);
        res.status(500).json({ error: 'Der opstod en fejl under login.' });
    }
});

app.post('/logout', (req, res) => {
    const { sessionId } = req.body;
    try {
        deleteSession(sessionId); // Slet sessionen
        return res.status(200).json({ message: 'Logout successful!' });
    } catch(error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'An error occurred during logout.' });
    }
});
  
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

//Importér Express-modulet
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { insertUser, findUser, insertCourse } = require('./modules/database');
const { hashPassword } = require('./modules/password-hasher');
const { validatePassword } = require('./modules/password-validator');
const { generateMFACode, verifyMFACode  } = require('./modules/mfa');
const { createSession, getSession, deleteSession, validateAndUpdateSession } = require('./modules/session');
const { fetchCourses, fetchCoursesByType } = require('./modules/database');
//const { setCookie, getCookie } = require('./modules/cookies');

//Opret en Express-app
const app = express();
app.use(cors({
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //Til redirects
const port = 3000;

// function validateSessionMiddleware(req, res, next) {
//     const sessionId = req.cookies.sessionId; // Antag at sessionId gemmes i en cookie
//     console.log("SessionId fra anmodning:", sessionId);
//     if (!sessionId || !validateAndUpdateSession(sessionId)) {
//         return res.status(401).json({ error: 'Session udløbet eller er ugyldig.' });
//     }
//     next(); // Hvis sessionen er gyldig, fortsæt til næste middleware eller rutehåndtering
// }

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
            // Set the session cookie
            //setCookie(res, 'sessionId', sessionId, { path: '/', maxAge: 604800000 } ); // Set the session cookie
            // Redirect brugeren til index.html i public-mappen
            console.log(res.getHeaders()); // Log the response headers
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
    const { username, password, confirmPassword } = req.body;
    try{
        const passwordValidation = validatePassword(password);
        const passwordHash = hashPassword(password);
        const usernameRegex = /^[a-zæøåA-ZÆØÅ0-9]{4,20}$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({ error: 'Brugernavnet er ugyldigt' });
        } 
        if (!passwordValidation.isValid) {
            return res.status(400).json({ error: passwordValidation.message });
        }
        if (confirmPassword !== password){
            return res.status(400).json({ error: 'Kodeordene matcher ikke'});
        }
        
        const user = {
            username: username,
            password: (await passwordHash).toString()
        };

        // await connectToDatabase();
        await insertUser(user);

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
app.post('/courses', async (req, res) => {
    try {
        console.log('Modtaget POST-anmodning til /courses');
        const courseData = req.body;
        console.log('Kursusdata modtaget:', courseData);
        // Indsæt kursusdata i databasen
        await insertCourse(courseData);
        res.status(201).json({ message: 'Kursus oprettet', course: courseData });
    } catch (error) {
        console.error('Fejl ved indsættelse af kursus:', error);
        res.status(500).json({ error: 'Der opstod en fejl under indsættelse af kursus.' });
    }
});

// Endpoint for hentning af kurser for private
app.get('/courses/private', async (req, res) => {
    try {
        // Fetch courses with type "private" from the database
        const privateCourses = await fetchCoursesByType('private');
        res.status(201).json(privateCourses); // Send the fetched courses as JSON response
    } catch (error) {
        console.error('Fejl ved hentning af kurser til private:', error);
        res.status(500).json({ error: 'En fejl opstod under hentning af kurser for private.' });
    }
});

// Endpoint for hentning af kurser for erhverv
app.get('/courses/erhverv', async (req, res) => {
    try {
        // Fetch courses with type "erhverv" from the database
        const erhvervCourses = await fetchCoursesByType('erhverv');
        res.status(201).json(erhvervCourses); // Send the fetched courses as JSON response
    } catch (error) {
        console.error('Fejl ved hentning af kurser til erhverv:', error);
        res.status(500).json({ error: 'En fejl opstod under hentning af kurser for private.' });
    }
});


//Start serveren
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});

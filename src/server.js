//Importér Express-modulet
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { insertUser, findUser, insertCourse } = require('./modules/database');
const { hashPassword } = require('./modules/password-hasher');
const { validatePassword } = require('./modules/password-validator');
const { generateMFACode, verifyMFACode  } = require('./modules/mfa');
const { createSession, getSession, deleteSession, validateAndUpdateSession } = require('./modules/session');
const { fetchCourses, fetchCoursesByType } = require('./modules/database');
const nodemailer = require('nodemailer');
const validator = require('validator');
//const { setCookie, getCookie } = require('./modules/cookies');

//Opret en Express-app
const app = express();
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); //Til redirects
app.use(
    session({
        secret: generateRandomString(),
        cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 604800000,
            sameSite: 'strict'
        }
    }
))
const port = 3000;

function isAuthenticated(req, res, next){
    if (req.session.user){
        next();
    }
    else{
        return res.status(200).json({ redirectUrl: '/login' });
    }
}

// Function to generate a random string
function generateRandomString() {
    return crypto.randomBytes(20).toString('hex');
  }

app.get('/login', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/html/login.html');
    res.sendFile(filePath);
});

app.get('/signup', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/html/signup.html');
    res.sendFile(filePath);
});

app.get('/business', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/html/business.html');
    res.sendFile(filePath);
});

app.get('/contact', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/html/contact.html');
    res.sendFile(filePath);
});

app.get('/courses', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/html/courses.html');
    res.sendFile(filePath);
});

app.get('/panel', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/html/panel.html');
    res.sendFile(filePath);
});

app.get('/private', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/html/private.html');
    res.sendFile(filePath);
});

app.get('/about', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/html/about.html');
    res.sendFile(filePath);
});

app.get('/', (req, res) => {
    const filePath = path.resolve(__dirname, '../public/index.html');
    res.sendFile(filePath);
});

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
        console.log(isPasswordValid);
        if (isPasswordValid) {
            // Password matcher
            req.session.user = { id: user._id, username: user.username };
            console.log(req.session.user);
            // Set the session cookie
            //req.session.save();
            res.cookie('sessionId', req.session.user, { maxAge: 604800000, httpOnly: true }); // Set the session cookie
            return res.status(200).json({ redirectUrl: '/login' });
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
app.post('/courses', isAuthenticated, async (req, res) => {
    try {
        console.log('Modtaget POST-anmodning til /courses');
        const courseData = req.body;
        if (typeof courseData.teachings === 'string') {
            // Adskil værdier efter mellemrum eller linjeskift
            courseData.teachings = courseData.teachings.split(',');
        }
        console.log('Kursusdata modtaget:', courseData);
        // Indsæt kursusdata i databasen
        await insertCourse(courseData);
        res.status(201).json({ message: 'Kursus oprettet', course: courseData, redirectUrl: '/panel' });
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
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'noemy.turner76@ethereal.email',
      pass: 'zWQUwMdH2B2UAXUPV8'
    }
});
app.post('/send-message', async (req, res) => {
    const { name, mail, message } = req.body;

    // Check if mail is undefined or not a string
    if (typeof mail !== 'string' || !mail.trim()) {
        return res.status(400).json({ error: 'Kunne ikke sende din besked: Den angivne email-addresse er ugyldig' });
    }

    // Validate email address
    if (!validator.isEmail(mail)) {
        return res.status(400).json({ error: 'Kunne ikke sende din besked: Den angivne email-addresse er ugyldig' });
    }

    try {
        // Send email to the company
        await transporter.sendMail({
            from: mail,
            to: 'perfectlyalignedroof@gmail.com',
            subject: 'Ny besked fra kontaktformular på BeredtBorgere.dk',
            text: `Name: ${name}\nEmail: ${mail}\nMessage: ${message}`
        });

        // Send confirmation email to the user
        await transporter.sendMail({
            from: 'BeredtBorgere.dk',
            to: mail,
            subject: 'Bekræftelse: Din besked er blevet sendt',
            text: 'Tak fordi du har kontaktet os hos BeredtBorgere.dk, din besked er blevet modtaget, og du får svar på denne mailaddresse hurtigst muligt.'
        });

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'An error occurred while sending the message' });
    }
});


//Start serveren
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});

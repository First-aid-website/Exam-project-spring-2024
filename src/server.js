//Importér Express-modulet
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nodemailer = require('nodemailer');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const { insertUser, findUser, insertCourse } = require('./modules/database');
const { hashPassword } = require('./modules/password-hasher');
const { validatePassword } = require('./modules/password-validator');
const { sanitizeInput  } = require('./modules/sanitization.js');
//const { generateMFACode, verifyMFACode  } = require('./modules/mfa');
const { fetchCourses, fetchCoursesByType } = require('./modules/database');

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
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "https://use.fontawesome.com"],
          imgSrc: ["'self'"],
          fontSrc: ["'self'", "https://use.fontawesome.com"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      hidePoweredBy: {},
      crossOriginResourcePolicy: true,
      referrerPolicy: { policy: 'same-origin' },
      noSniff: {},
    })
  );
  
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

const limiter_login = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutter
    max: 3, // 3 forsøg
    message: 'For mange ugyldige login forsøg, prøv igen om 5 minutter'
});

app.post('/login', limiter_login, async (req, res) => {
    const { username, password } = req.body;

    // Tjekker om inputfeltet er tomt
    if (!username) {
        return res.status(400).json({ error: 'Der skal skrives et brugernavn' });
    }
    // Server-side sanitization, matcher mod den samme regex som på clientside
    const validUsernameRegex = /[^a-zæøåA-ZÆØÅ0-9\s[.,()]/g;
    if (!validUsernameRegex.test(username)) {
        return res.status(400).json({ error: 'Invalid username format' });
    }
    // Vi tjekker inputfeltets validitet inden vi foretager database kald

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
            return res.status(200).json({ redirectUrl: '/' });
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

// app.post('/logout', (req, res) => {
//     const { sessionId } = req.body;
//     try {
//         deleteSession(sessionId); // Slet sessionen
//         return res.status(200).json({ message: 'Logout successful!' });
//     } catch(error) {
//         console.error('Error during logout:', error);
//         res.status(500).json({ error: 'An error occurred during logout.' });
//     }
// });
  
app.post('/signup', async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    try{
        const passwordValidation = validatePassword(password);
        const passwordHash = hashPassword(password);
        const usernameRegex = /^[a-zæøåA-ZÆØÅ0-9]{4,20}$/;
        const existingUser = await findUser(username);

        if (!usernameRegex.test(username)) {
            return res.status(400).json({ error: 'Brugernavnet er ugyldigt' });
        } 
        if (!passwordValidation.isValid) {
            return res.status(400).json({ error: passwordValidation.message });
        }
        if (confirmPassword !== password){
            return res.status(400).json({ error: 'Kodeordene matcher ikke'});
        }
        if (existingUser) {
            return res.status(400).json({ error: 'Brugernavnet er allerede i brug' });
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

        // Check if any required fields are empty
        const requiredFields = ['title', 'type', 'participants', 'dateDay', 'dateMonth', 'dateYear', 'startTimeHrs', 'startTimeMin', 'endTimeHrs', 'endTimeMin', 'price', 'description', 'content'];
        for (const field of requiredFields) {
            if (!courseData[field]) {
                return res.status(400).json({ error: `${field} skal udfyldes` });
            }
        }

        // Sanitize input data
        courseData = sanitizeInput(courseData);

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

const limiter_messages = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutter
    max: 2, // 2 requests hvert 5. minut
    message: 'Du kan kun sende to nye beskeder hvert femte minut'
});

let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: '587',
    secure: false,
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
    },
    auth: {
        user: 'kontakt-beredtborgere@outlook.com',
        pass: 'AJG3pctxsqhj7BE'
    },
    debug: true,
    logger:true,
});

app.post('/send-message', limiter_messages, async (req, res) => {
    const { name, mail, message } = req.body;

    // Check if any field is empty
    if (!name || !mail || !message) {
        return res.status(400).json({ error: 'Alle felter skal udfyldes' });
    }

    // Server-side sanitization, matcher mod den samme regex som på clientside
    const nameRegex = /[^a-zæøåA-ZÆØÅ\s]/g;
    if (nameRegex.test(name)) {
        return res.status(400).json({ error: 'Ugyldige tegn fundet i navn' });
    }

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
            from: 'kontakt-beredtborgere@outlook.com',
            to: 'walocial@hotmail.com', // Replace with the company email address
            subject: 'Ny besked fra kontaktformular på BeredtBorgere.dk',
            text: `Name: ${name}\nEmail: ${mail}\nMessage: ${message}`,
            replyTo: mail // Set the replyTo field to the user's email address
        });
    
        // Send confirmation email to the user
        await transporter.sendMail({
            from: 'kontakt-beredtborgere@outlook.com',
            to: mail, // Send confirmation email to the user
            subject: 'Bekræftelse: Din besked er blevet sendt',
            text: 'Tak fordi du har kontaktet os hos BeredtBorgere.dk, din besked er blevet modtaget, og du får svar på denne mailaddresse hurtigst muligt.'
        });

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'An error occurred while sending the message' });
    }
});
const limiter_joinCourse = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minut
    max: 1, // 1 requests hvert minut
    message: 'Du kan kun tilmelde dig ét kursus i minuttet'
});

app.post('/join-course', limiter_joinCourse, async (req, res) => {
    const { courseTitle, name, mail, amount } = req.body;
    // Check if any field is empty
    if (!name || !mail || !amount) {
        return res.status(400).json({ error: 'Alle felter skal udfyldes' });
    }
    if (amount > 16) {
        return res.status(400).json({ error: 'Du kan ikke bestille mere end 16 pladser'});
    }
    // Server-side sanitization for name
    const nameRegex = /[^a-zæøåA-ZÆØÅ\s]/g;
    if (nameRegex.test(name)) {
        return res.status(400).json({ error: 'Ugyldige tegn fundet i navn' });
    }

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
            from: 'kontakt-beredtborgere@outlook.com',
            to: 'walocial@hotmail.com', // Replace with the company email address
            subject: 'Ny tilmelding til kursus: ' + courseTitle,
            text: `Kursus: ${courseTitle}\nNavn: ${name}\nEmail: ${mail}\nAntal pladser: ${amount}`,
            replyTo: mail // Set the replyTo field to the user's email address
        });
    
        // Send confirmation email to the user
        await transporter.sendMail({
            from: 'kontakt-beredtborgere@outlook.com',
            to: mail, // Send confirmation email to the user
            subject: 'Bekræftelse: Du er nu tilmeldt kursus: ' + courseTitle,
            text: `Tak fordi du har tilmeldt dig kurset: ${courseTitle}. Vi har modtaget din tilmelding, og du får svar på denne mailadresse hurtigst muligt.`
        });

        res.status(200).json({ message: 'Tilmelding modtaget' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'An error occurred while sending the message' });
    }
});


//Start serveren
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});

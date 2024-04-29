const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config-settings.json');

const mongodb = config.mongodb.connection;
const dbname = config.mongodb.dbname;

const client = new MongoClient(mongodb, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase(){
    try{
        await client.connect();
        const db = client.db(dbname);
        console.log("Database connection was opened succesfully");
        return db;
    }
    catch(error){
        console.error("Error when opening database connection: ", error);
        throw error;
    }
}

async function closeDatabaseConnection(){
    try{
        await client.close();
        console.log("Database connection succesfully closed");
    }
    catch(error){
        console.error("Error when closing database connection: ", error);
        throw error;
    }
}

async function insertUser(user) {
    try {
        //Open db connnection
        const db = await connectToDatabase();
        //Choose tabel/collection
        const collection = db.collection('users');
        //Insert user into users
        await collection.insertOne(user);
        console.log('Brugeren blev indsat i databasen');
    } catch (error) {
        console.error('Fejl ved indsættelse af bruger i databasen: ', error);
        throw error;
    }
}

async function findUser(username){
    try{
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ username: username });
        return user;
    }
    catch(error){
        console.error('Fejl ved søgning efter bruger i databasen: ', error);
        throw error;
    }
}

async function fetchCourses() {
    try{
        const db = await connectToDatabase();
        const collection = db.collection('courses');
        const courses = await collection.find({}).toArray();
        return courses;
    }
    catch(error){
        console.error('Fejl ved søgning efter kurser i databasen: ', error);
        throw error;
    }
}
async function fetchCoursesByType(type) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('courses');
        const courses = await collection.find({ type: type }).toArray();
        return courses;
    } catch(error) {
        console.error('Fejl ved søgning efter kurser i databasen med typen: ' + type, error);
        throw error;
    }
}


module.exports = {
    connectToDatabase,
    closeDatabaseConnection,
    insertUser,
    findUser,
    fetchCourses,
    fetchCoursesByType
}
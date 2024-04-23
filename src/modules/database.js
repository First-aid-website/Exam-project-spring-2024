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
        console.log("database connection was opened succesfully");
        return db;
    }
    catch(error){
        console.error("error when opening database connection: ", error);
        throw error;
    }
}

async function closeDatabaseConnection(){
    try{
        await client.close();
        console.log("database connection succesfully closed");
    }
    catch(error){
        console.error("error when closing database connection: ", error);
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
        console.log('Bruger blev indsat i databasen');
    } catch (error) {
        console.error('Fejl ved indsættelse af bruger i databasen: ', error);
        throw error;
    }
}

module.exports = {
    connectToDatabase,
    closeDatabaseConnection,
    insertUser
}
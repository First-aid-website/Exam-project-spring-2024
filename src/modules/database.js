const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config-settings.json');

// Nu kan du tilgå forbindelsesoplysningerne fra config-objektet
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

async function whatever(){
    
}

module.exports = {
    connectToDatabase,
    closeDatabaseConnection
}
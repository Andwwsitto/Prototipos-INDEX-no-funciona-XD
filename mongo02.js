const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'Prototipos';
const client = new MongoClient(uri);
let db = null;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log('MongoDB conectado en', uri, 'db:', dbName);
  }
  return db;
}

async function getCollection(name = 'usuarios') {
  const database = await connect();
  return database.collection(name);
}

async function close() {
  if (client) {
    await client.close();
    db = null;
  }
}

module.exports = {
  connect,
  getCollection,
  close,
};
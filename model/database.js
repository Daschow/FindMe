
const { MongoClient } = require("mongodb");

const URI = "mongodb://admin-mongo:tVAXzVl3mOCTeUvVFkcafFKDAzmJ1BpPIfEWCdqtQc3su2xEgJqOcc3nt5wZWn2npHcGyAz49h7gusn6C6rfcw%3D%3D@admin-mongo.documents.azure.com:10255/?ssl=true";

const client = new MongoClient(URI);

module.exports.database = async (callback) => {
  try {
    // Connect the client to the server
    await client.connect();
    const database = client.db("admin");

    return await callback(database);

  } finally {
    await client.close();
  }
}

module.exports.addUser = async (userData) => {
  return this.database((db) => db.collection('message').insertOne({
    user: { ...userData, logDate: new Date() }
  }));
}



const { MongoClient } = require("mongodb");

const URI = "mongodb://admin-mongo:tVAXzVl3mOCTeUvVFkcafFKDAzmJ1BpPIfEWCdqtQc3su2xEgJqOcc3nt5wZWn2npHcGyAz49h7gusn6C6rfcw%3D%3D@admin-mongo.documents.azure.com:10255/?ssl=true";

module.exports.database = async (callback) => {
  const client = new MongoClient(URI);
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
    user: { ...userData, logDate: new Date()}
  }));
}

module.exports.addMessage = async (userId, message) => {
  return this.database((db) => db.collection('message').updateOne(
    { "user.id": userId },
    {
      $addToSet: {
        messages: {
          message,
          updateAt: new Date()
        }
      }
    }
  ));
}


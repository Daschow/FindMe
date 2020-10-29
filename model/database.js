
const { MongoClient } = require("mongodb");

const URI = "mongodb://admin-mongo:tVAXzVl3mOCTeUvVFkcafFKDAzmJ1BpPIfEWCdqtQc3su2xEgJqOcc3nt5wZWn2npHcGyAz49h7gusn6C6rfcw%3D%3D@admin-mongo.documents.azure.com:10255/?ssl=true";

const client = new MongoClient(URI);

const database = async (callback) => {
  // Connect the client to the server
  await client.connect();
  const database = client.db("admin");

  const result = await callback(database);
  return result;
}

const addUser = (userData) => {
  return database((db) => db.collection('user').insertOne({
    user: { ...userData, logDate: new Date() }
  }));
}

const addMessage = (userId, message) => {
  return database((db) => db.collection('message').insertOne(
    {
      messages: {
        userId,
        message,
        updatedAt: new Date()
      }
    },
  ));
}

const getMessages = async () => {
  return database((db) => db.collection('message').aggregate([
    {
      $lookup: {
        from: 'user',
        localField: 'userId',
        foreignField: 'user.id',
        as: 'user'
      }
    }
  ]).toArray());
}

const disconnectDb = async () => {
  await client.close();
}


module.exports = { client, database, addUser, addUser, addMessage, getMessages, disconnectDb };

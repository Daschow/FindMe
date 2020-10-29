mongoClient = require("mongodb").MongoClient;
mongoClient.connect(
  "mongodb://admin-mongo:tVAXzVl3mOCTeUvVFkcafFKDAzmJ1BpPIfEWCdqtQc3su2xEgJqOcc3nt5wZWn2npHcGyAz49h7gusn6C6rfcw%3D%3D@admin-mongo.documents.azure.com:10255/?ssl=true",
  function (err, client) {
    console.log(client);
    client.close();
  }
);

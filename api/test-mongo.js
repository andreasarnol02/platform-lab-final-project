const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

(async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected!");
    await client.close();
  } catch (e) {
    console.error(e);
  }
})();
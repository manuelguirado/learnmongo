import { MongoClient } from "mongodb";
import "dotenv/config";
 
// Construye el URI de conexión de Atlas usando las variables de entorno
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@learning.cps1ntj.mongodb.net/?retryWrites=true&w=majority`;

// El resto del código permanece igual
const client = new MongoClient(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
    maxPoolSize: 150, // Set the maximum number of connections in the pool
  },
});
// Connect the client to the server
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You are connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
}

async function createDatabase() {
  try {
    // Create a new database named "myexmpledb"
    const db = client.db("myexmpledb");
    console.log(`Database created: ${db.databaseName}`);
    //Create a new collection named "mycollection"
    const collection = db.collection("mycollection");
    // Insert a document into the collection
    const doc = { name: "example", age: 30 };
    const result = await collection.insertOne(doc);
    console.log(`Inserted document with _id: ${result.insertedId}`);
    const colls = db.listCollections();
    for await (const coll of colls) {
      console.log(coll);
    }
  } catch (err) {
    console.log(err);
  }
}

run().catch(console.dir);
createDatabase().catch(console.dir);

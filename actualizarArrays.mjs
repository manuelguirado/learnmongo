import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

dotenv.config();
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@learning.cps1ntj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
    maxPoolSize: 150, // Set the maximum number of connections in the pool
  },
});
async function connectToMongo() {
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
    const db = client.db("myexampledb");
    console.log(`Database created: ${db.databaseName}`);
    const collection = db.collection("actualizarArrays");
    const docs = [
      { name: "example", age: 30, hobbies: ["reading", "gaming"] },
      { name: "example2", age: 31, hobbies: ["sports", "music"] },
      { name: "example3", age: 32, hobbies: ["cooking", "traveling"] },
    ];
    const result = await collection.insertMany(docs);
    let ids = result.insertedIds;
    for (let id of Object.values(ids)) {
      console.log(`Inserted document with _id: ${id}`);
    }
  } catch (err) {
    console.error(err);
  }
}
async function updateArrayFirstElement() {
  try {
    const db = client.db("myexampledb");
    const collection = db.collection("actualizarArrays");
    const query = { name: "example" };
    const update = {
      $set: { "hobbies.0": "reading books" }, // Update the first element of the array
    };
    const result = await collection.updateOne(query, update);
    console.log(`Updated ${result.modifiedCount} document(s)`);
  } catch (err) {
    console.error(err);
  }
}
async function run() {
  try {
    await connectToMongo();
    await createDatabase();
    await updateArrayFirstElement();
    await client.close();
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.error);

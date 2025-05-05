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
    try{
        const db = client.db("myexampledb");
        console.log(`Database created: ${db.databaseName}`);
        const collection = db.collection("eliminarDocumentos");
        const docs = [
            { name: "example", age: 29  },
            { name: "example2", age: 31 },
            { name: "example3", age: 32 }
        ];
        const result = await collection.insertMany(docs);
        let ids = result.insertedIds;
        for (let id of Object.values(ids)){
            console.log(`Inserted document with _id: ${id}`);
        }
    }catch(err){
        console.error(err);
    }
}
async function deleteManyDocuments() {
    try{
        const db = client.db("myexampledb");
        const collection = db.collection("eliminarDocumentos");
        const query = { age: { $gt: 30 } }; // Delete documents where age is greater than 30
        const result = await collection.deleteMany(query);
        console.log(`Deleted ${result.deletedCount} document(s)`);
    }catch(err){
        console.error(err);
    }
}
async function run() {
    try{
        await connectToMongo();
        await createDatabase();
        await deleteManyDocuments();
    }catch(err){
        console.error(err);
    }finally{
        await client.close();
    }
}
run().catch(console.error);
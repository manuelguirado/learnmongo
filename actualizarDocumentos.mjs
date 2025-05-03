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
        //create a new database named "myexmpledb"
        const db = client.db("myexmpledb");
        console.log(`Database created: ${db.databaseName}`);
        //create a new collection named "actualizarDocumentos"
        const collection = db.collection("actualizarDocumentos");
        // Insert into the collection one document
        const docs = [
            { name: "example", age: 30 },
            { name: "example2", age: 31 },
            { name: "example3", age: 32 }
        ];
        const result = await collection.insertMany(docs);
        let ids = result.insertedIds;
        for (let id of Object.values(ids)){
            console.log(`Inserted document with _id: ${id}`);
        }
    }catch(err){
        console.log(err);
    }
}
async function updateOneDocument() {
  try{
    console.log("Updating one document...");
    const db = client.db("myexmpledb");
    const collection = db.collection("actualizarDocumentos");
    const query = { name: "example" };
    const update = {
      $set: { age: 35 },
    };

    const options = {}
    const result = await collection.updateOne(query, update, options);
    console.log(`Updated ${result.modifiedCount} document(s)`);
   
  }catch(err){
    console.log(err);
  }

}
async function updateWithUpsert() {
    try{ 
        console.log("Updating document with upsert...");
        const db = client.db("myexmpledb");
        const collection = db.collection("actualizarDocumentos");
        const query = { name: "example3" };
        const update = {
            $set: { age: 50 },
        };
        const options = { upsert: true };

        console.log("Updating document...");
        const result = await collection.updateOne(query, update, options);
        console.log(`Updated ${result.modifiedCount} document(s)`);

    }catch(err){
        console.log(err);
    }

}
async function updateManyDocuments() {
    try{
        console.log("updating many documents...");
        const db = client.db("myexmpledb");
        const collection = db.collection("actualizarDocumentos");
        const query = { age: { $lt: 35 } };
        const update = {
            $set: { age: 40 },
        };
        const options = { upsert: true };
        const result = await collection.updateMany(query, update, options);
        console.log(`Updated ${result.modifiedCount} document(s)`);
    }catch(err){
        console.err(err);
    }
}
async function run() {
    await connectToMongo();
    await createDatabase();
    await updateOneDocument();
    await updateWithUpsert();
    await updateManyDocuments();
    await client.close();
}
run().catch(console.dir);
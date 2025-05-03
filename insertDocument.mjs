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
async function connectToMongo(){
    try{
        await client.connect();
        console.log("Connected to MongoDB");
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You are connected to MongoDB!");
    }catch(err){
        console.log(err);
    }
}

async function createDatabase(){
    try{
        //Create a new database named "myexmpledb"
        const db = client.db("myexmpledb");
        console.log(`Database created: ${db.databaseName}`);
        //Create a new collection named "insertDocument"
        const collection = db.collection("insertDocument");
    
    }catch(err){
        console.log(err);
    }
}
async function insertDocument(){
    try{
        //use a database named "myexmpledb"
        const db = client.db("myexmpledb");
        //use a collection named "insertDocument"
        const collection = db.collection("insertDocument");
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
async function run() {
    await connectToMongo();
    await createDatabase();
    await insertDocument();
}
run().catch(console.dir);
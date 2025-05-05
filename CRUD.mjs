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
  

    }catch(err){
        console.error(err);
    }
}
async function insertDocument(Documents){
    try{
        const db = client.db("myexampledb");
        const collection = db.collection("CRUD");
        const result = await collection.insertMany(Documents);
        let ids = result.insertedIds;
        for (let id of Object.values(ids)){
            console.log(`Inserted document with _id: ${id}`);
        }

    }catch(err){
        console.error(err);
    }
}
async function insertOneDocument(Document){
    try{
        const db = client.db("myexampledb");
        const collection = db.collection("CRUD");
        const result = await collection.insertOne(Document);
        let ids = result.insertedId;
        console.log(`Inserted document with _id: ${ids}`);
    }catch(err){
        console.error(err);
    }
}
async function updateManyDocuments () {
    try{
        const db = client.db("myexampledb");
        const collection = db.collection("CRUD");
        const query = { age: { $gt: 30 } }; // Update documents where age is greater than 30 
        const update = {
            $set: { age: 60 },
        };
    
        const result = await collection.updateMany(query, update);
        console.log(`Updated ${result.modifiedCount} document(s)`);
       
    }catch(err){
        console.error(err);
    }
}
async function updateOneDocument () {
    try{
        const db = client.db("myexampledb");
        const collection = db.collection("CRUD");
        const query = { age : {$gt: 30} };
        const update = {
            $set: { age: 35 },
        };
    
        const result = await collection.updateOne(query, update);
        console.log(`Updated ${result.modifiedCount} document(s)`);
       
    }catch(err){
        console.error(err);
    }

}
 let operation = process.argv[2];
 switch (operation) {

    case "connect":
        connectToMongo();
        break;
    case "createDatabase":
        connectToMongo();
        createDatabase();
        break;
    case "insertDocument":
        connectToMongo();
        insertDocument([{ name: "example", age: 30 }, { name: "example2", age: 31 }, { name: "example3", age: 32 }]);
        break;
    case "insertOneDocument":
        connectToMongo();
        insertOneDocument({ name: "example3", age: 50 });
        break;
    case "updateManyDocuments":
        connectToMongo();
        updateManyDocuments();
        break;
    case "updateOneDocument":
        connectToMongo();
        updateOneDocument({ name: "example", age: 30 });
        break;
    default:
        console.log("Invalid operation");
        break;





 }
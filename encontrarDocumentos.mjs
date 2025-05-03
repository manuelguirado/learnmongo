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
    //create a new database named "myexampledb"
    const db = client.db("myexampledb");
    console.log(`Database created: ${db.databaseName}`);
    //create a new collection named "encontrarDocumentos"
    const collection = db.collection("encontrarDocumentos");
    // Insert into the collection one document
    const docs = [
      { name: "example", age: 30 },
      { name: "example2", age: 31 },
      { name: "example3", age: 32 },
    ];
    const result = await collection.insertMany(docs);
    let ids = result.insertedIds;
    for (let id of Object.values(ids)) {
      console.log(`Inserted document with _id: ${id}`);
    }
  } catch (err) {
    console.log(err);
  }
}

async function findDocuments() {
  try {
    //use a database named "myexampledb "
    const db = client.db("myexampledb");
    //use a collection named "encontrarDocumentos"
    const collection = db.collection("encontrarDocumentos");
    // Find all documents in the collection
    console.log("Finding documents..., without filter");
    const docs = await collection.find({}).toArray();
    console.log("Documents found:");
    for (let doc of docs) {
      console.log(doc);
    }
    // Find documents with a filter
    console.log("Finding documents..., with filter");
    const filter = { age: { $lt: 31 } }; // Filter for documents where age is greater than 30 step  1 filter
    const filteredDocs = await collection.find(filter).toArray();
    console.log("Filtered documents found:");
    for (let doc of filteredDocs) {
      console.log(doc);
    }
    //using aggregation
    console.log("Finding documents..., using aggregation");
    const pipeline = [
      { $match: { age: { $lt: 31 } } }, // Filter for documents where age is greater than 30 step 1 filter
      { $group: { _id: "$name", totalAge: { $sum: "$age" } } }, // Group by name and sum the ages step 2 group
    ];
    const aggDocs = await collection.aggregate(pipeline).toArray();
    console.log("Aggregated documents found:");
    for (let doc of aggDocs) {
      console.log(doc);
    }
  } catch (err) {
    console.log(err);
  }
}
//sort documents
async function sortDocuments() {
  try {
    //use a database named "myexampledb "
    const db = client.db("myexampledb");
    //use a collection named "encontrarDocumentos"
    const collection = db.collection("encontrarDocumentos");
    // Find all documents in the collection
    console.log("Finding documents..., without filter");
    const docs = await collection.find({}).toArray();
    console.log("Documents found:");
    for (let doc of docs) {
      console.log(doc);
    }
    // Find documents with a filter
    console.log("Finding documents..., with filter");
    const query = {};
    const sortFields = { length: -1 }; // Sort by age in ascending order
    const cursor = collection.find(query).sort(sortFields);
    const sortedDocs = await cursor.toArray();
    console.log("Sorted documents found:");
    for (let doc of sortedDocs) {
      console.log(doc);
    }
  } catch (err) {
    console.log(err);
  }
}
async function limit() {
  try {
    //use a database named "myexampledb "
    const db = client.db("myexampledb");
    // use a collection named "encontrarDocumentos"
    const collection = db.collection("encontrarDocumentos");
    const query = {};
    const options = {
      limit: 2, // Limit the number of documents to 2
      sort: { age: -1 }, // Sort by age in descending order
    };
    //create a cursor
    const cursor = collection
      .find(query)
      .sort(options.sort)
      .limit(options.limit);
    // Convert the cursor to an array
    const limitedDocs = await cursor.toArray();
    console.log("Limited documents found:");
    for (let doc of limitedDocs) {
      console.log(doc);
    }
  } catch (err) {
    console.log(err);
  }
}
async function skip() {
  try {
    const db = client.db("myexampledb");
    // use a collection named "encontrarDocumentos"
    const collection = db.collection("encontrarDocumentos");
    const query = {};
    const options = {
      skip: 1, // Skip the first document
      limit: 2, // Limit the number of documents to 2
      sort: { age: -1 }, // Sort by age in descending order
    };
    //create a cursor
    const cursor = collection
      .find(query)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
    // Convert the cursor to an array
    const limitedDocs = await cursor.toArray();
    console.log("Limited documents found:");
    for (let doc of limitedDocs) {
      console.log(doc);
    }
  } catch (err) {
    console.log(err);
  }
}
async function retornarUnCampo() {
  try {
    //use the database name   "myexampledb "
    const db = client.db("myexampledb");
    //use a collection named "encontrarDocumentos"
    const collection = db.collection("encontrarDocumentos");
    //return only the name field
    const proyectFields = { name: 1 };
    const cursor = collection.find().project(proyectFields);
    const docs = await cursor.toArray();
    console.log("Documents found:");
    for (let doc of docs) {
      console.log(doc);
    }
  } catch (err) {
    console.log(err);
  }
}
async function retornarVariosCampos() {
  try {
    //use the database name   "myexampledb "
    const db = client.db("myexampledb");
    //use a collection named "encontrarDocumentos"
    const collection = db.collection("encontrarDocumentos");
    //return only the name and age fields
    const proyectFields = { name: 1, age: 1 };
    const cursor = collection.find().project(proyectFields);
    const docs = await cursor.toArray();
    console.log("Documents found:");
    for (let doc of docs) {
      console.log(doc);
    }
  } catch (err) {
    console.log(err);
  }
}

async function run() {
  await connectToMongo();
  await createDatabase();
  await findDocuments();
  await sortDocuments();
  await limit();
  await skip();
  await retornarUnCampo();
  await retornarVariosCampos();
  await client.close();
}
run().catch(console.dir);

import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db: Db;

const uri = `${process.env.MONGO_DB_URI}`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

export const connectToDatabase = async () => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    db = client.db("Connectly");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

export const getDatabase = () => {
  if (!db) {
    var sdsd = db;
    var sdszd = "sdsd";
    throw new Error("Database not connected");
  }
  return db;
};

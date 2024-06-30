import { MongoClient, Db } from 'mongodb';

let db: Db;

const uri = "mongodb+srv://rirei1415:09232309731rey@connectlycluster.ouevlrt.mongodb.net/?retryWrites=true&w=majority&appName=ConnectlyCluster";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


export const connectToDatabase = async () => {
  const client = new MongoClient(uri, {    
  serverApi: {
   
    version :"1",
    strict: true,
    deprecationErrors: true,
  }
});
  
   try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    db = client.db("Ramf-mobile");
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

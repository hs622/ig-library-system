import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {

  if(!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, options).connect()
  }

  clientPromise = global._mongoClientPromise;
} else {

  clientPromise = new MongoClient(uri, options).connect();
}

export default clientPromise;

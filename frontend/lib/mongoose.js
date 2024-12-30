import { TextEncoder, TextDecoder } from "text-encoding";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import mongoose from "mongoose";

// * get mongodb uri from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// * throw an error if mongodb uri not defined
if (!MONGODB_URI) {
  throw new Error("Define MONGODB_URI in .env.local");
}

// * cache the mongodb connection globally to prevent multiple connections
let cached = global.mongoose;

// * initialise the cache if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// * function to connect to database
async function connectToDatabase() {
  if (cached.conn) {
    // * if connection already exists return it
    return cached.conn;
  }

  // * if connection promise doesn't exist create one
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // * create connection promise and store in cache
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // * wait for the connection promise and store in cache
  cached.conn = await cached.promise;
  return cached.conn;
}

// * export the connectToDatabase function as the default export
export default connectToDatabase;

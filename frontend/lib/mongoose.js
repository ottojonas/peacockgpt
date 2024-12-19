import mongoose from "mongoose";

// * get mongodb uri from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// * throw an error if mongodb uri not defined
if (!MONGODB_URI) {
  throw new Error("Define MONGODB_URI in .env.local");
}

// * cache the mongodb connection globally to prevent multiple connections
let cached = global.mongoose;

// * initialise the chase if it doesnt exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// * function to connect to database
async function connectToDatabase() {
  if (cached.conn) {
    // * if connection already exists return if
    return cached.conn;
  }

  // * if connection promise doesnt exist create one
  if (!cached.promise) {
    const opts = {
      // ! depreciated
      useNewUrlParser: true, // * use new url parser
      // ! depreciated
      useUnifiedTopology: true, // * use new server discover and onitoring engine
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

// * export the connectToDatebase function as the default export
export default connectToDatabase;

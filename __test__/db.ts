import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

export const connect_db = async () => {
  if (!mongoServer) {
    // If mongoServer is not initialized, create a new instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { dbName: "EazipayTest" });
  }
};

export const drop_db = async () => {
  if (mongoServer) {
    await mongoose.connection.close();
    await mongoServer.stop();
    // mongoServer = null;
  }
};

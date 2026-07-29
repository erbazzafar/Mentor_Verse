import mongoose from "mongoose";
import dns from "dns";

// Force Node to use Google's DNS for this process only (no system/Wi-Fi changes)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

export default dbConnect;
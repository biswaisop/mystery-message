import { promises } from "dns";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("connected to database");
        return
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        connection.isConnected = db.connections[0].readyState
        console.log("DB CONNECTED");
    }catch(error){
        console.log("DB CONNECTION FAILED")
        process.exit()
    }
}

export default dbConnect
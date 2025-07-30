import { error } from "console";
import mongoose, { mongo } from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = { }

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log('Already Connected to database');
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected Successfully");
    }catch(error){
        console.log("DataBase Connection Failed",error)
    }
}

export default dbConnect;
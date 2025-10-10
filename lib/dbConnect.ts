import mongoose from "mongoose";


type ConnectionObject  = {
   isConnected?: number
}

const connection : ConnectionObject = {}


export const dbConnect = async (): Promise<void> =>{
    try {

        if(!process.env.MONGODB_URI){
            console.log("MONGODB URI not specified");
            process.exit(1)
        }

        if(connection.isConnected){
            console.log("DB already connected");
        }
        else{
            const db = await mongoose.connect(process.env.MONGODB_URI || "")
            connection.isConnected = db.connections[0].readyState
            console.log("DB connected successfully");
        }
        
    } catch (error) {
        console.log("Database connection error", error);
        process.exit(1)
    }
}
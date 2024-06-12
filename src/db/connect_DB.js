import mongoose from "mongoose";

const connect_DB=async()=>{
    try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        console.log(`MongoDB connected on DB HOST!! ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongo_DB failed to connect error:",error);
        process.exit(1);
    }
   
}


export default connect_DB;
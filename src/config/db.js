const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        if(!process.env.DB_URL){
            throw new Error("DB_URL is not found in .env file")
        }
      const conn =  await mongoose.connect(process.env.DB_URL)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}

module.exports= connectDB
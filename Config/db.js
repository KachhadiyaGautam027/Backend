const mongoose = require("mongoose");
require('dotenv').config(); 

const connect = async () => {
    try {
        await mongoose.connect(process.env.SERVER, {
            serverSelectionTimeoutMS: 5000 
        });
        console.log("Mongoose connected successfully");
    } catch (error) {
        console.error("Mongoose connection error:", error);
        process.exit(1); 
    }
};

module.exports = connect;

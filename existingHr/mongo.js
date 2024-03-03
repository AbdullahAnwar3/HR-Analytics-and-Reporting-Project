const mongoose=require("mongoose"); // Mongoose library for MongoDB interaction

// Connected to the MongoDB database hosted at "mongodb://0.0.0.0:27017/login-credentials"
mongoose.connect("mongodb://0.0.0.0:27017/login-credentials")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed'); 
    });

// Defining a new Mongoose schema for our MongoDB collection
const newSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// We created a model named "collection" based on the defined schema
const collection = mongoose.model("collection", newSchema);

module.exports = collection; // Exporting the "collection" model for use in other files


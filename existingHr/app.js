// Import required modules: 
const express = require("express"); // importing Express.js for creating our web server
const collection = require("./mongo"); // importing our MongoDB connection setup
const cors = require("cors"); // We are importing middleware for enabling CORS in Express
const app = express(); // Creating instance of our Express application

// Middleware to parse incoming JSON requests
app.use(express.json()); 
// Middleware to parse incoming URL-encoded requests with extended syntax
app.use(express.urlencoded({ extended: true })); 
// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors()); 

// Defining an endpoint for login requests and then extracting email and password from request body
app.post("/", async (req, res) => {
    //
    const { email, password } = req.body;
    try {
        // An attempt to find a document in the 'collection' collection matching the provided email and password
        const check = await collection.findOne({ email: email, password: password}); 
        // If a document is found, responding with "exist", else "notexist"
        if (check) {
            res.json("exist"); 
        } else { 
            res.json("notexist"); 
        }
    } catch (e) { // If an error occurs during database operation, responding with "fail"
        res.json("fail"); 
    }
});

// Starting the server and making it listen on a port.
app.listen(8000, () => {
    console.log("Server listening on port 8000"); // We logged a message indicating that the server is listening on port 8000
});






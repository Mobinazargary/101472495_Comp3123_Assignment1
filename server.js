const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');  // Updated to match file name
const employeeRoutes = require('./routes/employeeRoutes');
const mockRoutes = require("./routes/mockRoutes");

const DB_URL = "mongodb+srv://admin:Mn%40590241@cluster0.yxkqj.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(DB_URL)
    .then(() => {
        console.log("Successfully connected to the MongoDB Atlas database");
    })
    .catch(err => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

// Default route
app.get('/', (req, res) => {
    res.send("<h1>Welcome</h1>");
});

// Middleware
app.use(express.json());

// Use Mock Routes
app.use("/api/v1/mock", mockRoutes);

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

// Start the server
app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});

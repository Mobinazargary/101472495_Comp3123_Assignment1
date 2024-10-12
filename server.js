const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const mockRoutes = require("./routes/mockRoutes");
require('dotenv').config();  // Load environment variables from .env file



const app = express();

app.use(express.static('public'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB Atlas using environment variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Successfully connected to the MongoDB Atlas database");
    })
    .catch(err => {
        console.error("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

// Default route
app.get('/', (req, res) => {
    res.send("<h1>Welcome</h1>");
});

// Use Routes
app.use("/api/v1/mock", mockRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');


const userRoutes = require('./src/routes/User')


//EXPRESS SERVER  AND MONGODB CONFIGURATION
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors()); // Use this before your routes
app.use(express.json()); 
app.use(userRoutes)

const mongourl = 'mongodb://127.0.0.1:27017/Brill'

mongoose.connect(mongourl);

mongoose.connection.on('connected', () => {
	console.log('Connected to mongo DB!...');
});

mongoose.connection.on('error', (err) => {
	console.log('Error Connecting to mongo!...', err);
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

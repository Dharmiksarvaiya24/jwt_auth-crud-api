const express = require('express');
const cors  = require('cors');
const jwt =require('jsonwebtoken');

const app = express();

require('dotenv').config();

const userrouter = require('./routers/user');
const datarouter = require('./routers/details');
const {connectDB} = require('./connection');
const {log, auth} = require('./middelwares');

//connection
connectDB(process.env.MongoDB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(log);

// routes
app.use('/user', userrouter);
app.use('/api/details',auth, datarouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

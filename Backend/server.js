const express = require('express');
const cors  = require('cors');

const app = express();

require('dotenv').config();

const userrouter = require('./routers/user');
const datarouter = require('./routers/details');
const {connectDB} = require('./connection');
const {log} = require('./middelwares');

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
app.use('/api/details', datarouter);

app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});

const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB(mongoURI) {
    return mongoose.connect(mongoURI);
}

module.exports = {
    connectDB,
    mongoose,
};
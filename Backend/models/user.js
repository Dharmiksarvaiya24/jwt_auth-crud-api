const mongoose = require('mongoose');

const userdetails = new mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
    { timestamps : true}
);

const userdata = mongoose.model('User', userdetails);
    
module.exports = userdata;
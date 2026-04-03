const mongoose = require('mongoose');

const flightdetails = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  departure: {
    type: String,
    required: true
  },
  arrival: {
    type: String,
    required: true
  },
},
    { timestamps : true}
);

const flightdata = mongoose.model('flightdata', flightdetails);

module.exports = flightdata;
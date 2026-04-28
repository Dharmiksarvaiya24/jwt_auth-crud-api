const mongoose = require('mongoose');

const flightdetails = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
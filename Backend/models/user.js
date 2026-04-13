const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

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
  },


  otpHash: {
    type: String,
    required: false
  },
   otpExpiry: {
    type: Date,
    required: false
  },
  otppurpose: {
    type: String,
    required: false
  },
  otpnumber: {
    type: Number,
    required: false
  }

  
},
    { timestamps : true}
);

userdetails.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userdetails.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userdata = mongoose.model('User', userdetails);
    
module.exports = userdata;

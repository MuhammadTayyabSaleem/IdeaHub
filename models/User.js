const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name:{
      type: String,
      required: true
    },
    email:{
      type: String,
      required: true
    },
    
    type:{
      type: String,
      required: true

    },
    password:{
      type: String,
      required: true
    },
    avatar:{
      type: String 
    },
    balance:{
      type: String,
      default: '10000'
    },
    date:{
      type: Date,
      default: Date.now
    },
  });

  module.exports = User = mongoose.model('users',userSchema, 'users');
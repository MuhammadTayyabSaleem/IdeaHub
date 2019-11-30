const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required:true
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required:true
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref:'posts',
      required: true
    },
    shares:{
      type: String,
      default:''
    },
    amount:{
      type: String,
      default:''
    },
    message:{
      type: String,
      default:''
    },
    servicePrice:{
      type: String,
      default:''
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

  module.exports = Request = mongoose.model('request', RequestSchema);
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
      required:true
    },
    amount:{
      type: String,
      required:true
    }
  });

  module.exports = Request = mongoose.model('request', RequestSchema);
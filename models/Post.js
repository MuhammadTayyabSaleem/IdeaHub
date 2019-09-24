const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  }
  ,
  sharePrice: {
    type: String
  },
  shareHolders:[{
    userId:{
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    sharesPurchased:{
      type: String
    }
  }]
  ,
  sharesSold: {
    type: String,
    default: 0
  }
  ,
  service: [{
    name:{
      type: String
    },
    price:{
      type: String
    },
    share:{
      type: String
    }
  }]
  ,
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('posts', PostSchema,'posts');

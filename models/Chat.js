const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  chat: [{
    from:{
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    message:{
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
  
});

module.exports = Chat = mongoose.model('chats', ChatSchema,'chats');

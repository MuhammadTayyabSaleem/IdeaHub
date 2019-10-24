const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const client  = require('socket.io').listen(4000).sockets;
const Chat = require('../../models/Chat');


router.get('/test', (req,res) => res.json({msg: "Welcome to chats.js"}));

//save chat
router.post(
  '/',
  (req, res) => {

    // Check Validation
    Chat.findOne( {
      $or: [
        { $and: [{user1: req.body.user1}, {user2: req.body.user2}] },
        { $and: [{user1: req.body.user2}, {user2: req.body.user1}] }
    ]
  } )
    .then(chatFound =>{
      if(!chatFound){
        const newChat = {};
      newChat.user1= req.body.user1;
      newChat.user2= req.body.user2;
      newChat.chat = {};
      newChat.chat.from = req.body.user1;
      newChat.chat.message = req.body.message;

    new Chat(newChat).save()
    .then(chat => res.json(chat))
    .catch(err => console.log(err));
      }
      else{
        const newChat = {};
        newChat.from = req.body.user1;
        newChat.message = req.body.message;
        chatFound.chat.unshift(newChat);
        chatFound.save().then( chat2 => res.json({from:{name:req.body.from,avatar:req.body.avatar},message:req.body.message}) 
      );
      }
    })
    .catch(err => console.log(err));
    
  }
);

// Get all chats 
router.post(
  '/getChats',
  (req, res) => {

    // Check Validation
    Chat.find( {
           $or: [{user1: req.body.userId}, {user2: req.body.userId}] 
  } )
  .populate('user2', ['name', 'avatar'])
  .populate('user1', ['name', 'avatar'])
    .then(chat =>{
      if(!chat){
        res.json({msg:'No chats found for this user'});
      }
      else{
        res.json(chat);
      }
    })
    
  }
);


router.post(
  '/getChat',
  (req, res) => {

    // Check Validation
    Chat.findOne( {
      $and: [
          { $or: [{user1: req.body.user1}, {user1: req.body.user2}] },
          { $or: [{user2: req.body.user1}, {user2: req.body.user2}] }
      ]
  } )
  .populate('chat.from',['name','avatar'])
    .then(chat =>{
      if(!chat){
        const newChat = {};
      newChat.user1= req.body.user1;
      newChat.user2= req.body.user2;
      newChat.chat = {};
      newChat.chat.from = '5db04d7ae9b743213c9d4bcc';
      newChat.chat.message = 'Start a Chat';

    new Chat(newChat).save()
    .then(chat => res.json(chat))
    .catch(err => console.log(err));
      }
      else{
        return res.json(chat);
      }
    })
    .catch(err => console.log(err));
    
  }
);

module.exports = router;
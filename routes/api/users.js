const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const User = require('../../models/User');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get('/test', (req,res) => res.json({msg: "Users works"}));

router.post('/register', (req,res) => {
  const {errors,isValid} = validateRegisterInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }


  User.findOne({email: req.body.email})
  .then(user => {
      if(user) {
        errors.email = 'Email Already Exists'
        return res.status(400).json(errors);
      }
      else{
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          type: req.body.type,
          password: req.body.password
        }); 
        bcrypt.genSalt(10, (err,salt) => {
          bcrypt.hash(newUser.password,salt,(err,hash) => 
          {
            if(err){
              throw err;
            }
            
              newUser.password = hash;
              newUser.save()
              .then(user => {
                res.json(user);})
              .catch(); 
            
          })
        })
      }
    })
});

router.post('/login', (req,res) => 
{
  const {errors,isValid} = validateLoginInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
  .then(user =>{
    if(!user){
      errors.email = 'User not found!'
      return res.status(404).json(errors);
    }
    bcrypt.compare(password,user.password)
    .then(isMatched =>
    {
      if(isMatched){
        

        const payload = {id: user.id, name:user.name, avatar: user.avatar , type: user.type, balance: user.balance}
        
        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600},(err,token) =>{
          res.json({success:true,
            token:'Bearer ' + token})
        });
      }
      else{
        errors.password = "Incorrect Password"
        return res.status(400).json(errors);
      }
      });
  });
});

router.post('/balance', (req,res) => 
{

  User.findOne({_id: req.body.id})
  .then(user =>{
    if(!user){
      
      return res.json({balance:'0'});
    }
    else{
      return res.json({balance:user.balance})
    }
  });
});

//api/users/current
router.get('/current',
  passport.authenticate('jwt',{Session:false}), 
  (req,res) => {
    const message ={};
    message.userID = req.user.id;
    message.name = req.user.name;
    message.email = req.user.email;
    res.json(message);
});


module.exports = router;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
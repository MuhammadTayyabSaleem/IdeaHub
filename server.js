const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const chats = require('./routes/api/chats');
const passport = require('passport');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connet to MongoDB
//  mongoose
//   .connect('mongodb://localhost:27017/mongoDB-MERN', { useNewUrlParser: true })
//   .then(() => console 
//   .log(`Local db connected`))
//   .catch(err => console.log(err));

  mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch(err => console.log(err));

//passport
app.use(passport.initialize());
require('./config/passport')(passport); 


//Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/chats', chats);

const port = process.env.port || 5000;
app.listen(port,() => console.log(`Server Running on ${port}`));



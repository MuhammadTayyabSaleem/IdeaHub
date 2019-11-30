const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

const Request = require('../../models/Request');

// Validation
const validatePostInput = require('../../validation/post');
const is_Empty = require('../../validation/is-empty');
const validateCommentInput = require('../../validation/comment');
const validateRequestInput = require('../../validation/request');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.post('/forDeveloper', (req, res) => {
  if (is_Empty( req.body) ){
    Post.find({
     $or:[
       {service: {$ne:''}},
       {sharePrice: {$ne:''}}
     ]
    })
    .populate('users')
      .sort({ date: -1 })
      .skip(0)
      .limit(10)
      .then(posts => {
        Post.find({
          $or:[
            {service: {$ne:''}},
            {sharePrice: {$ne:''}}
          ]
         }).countDocuments().then(count =>{
          data = {};
          data['posts'] = posts;
          data['count'] = count;
          
          res.json(data)
        });
      })
      .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
}
else{
  Post.find({
    $or:[
      {service: {$ne:''}},
      {sharePrice: {$ne:''}}
    ]
  })
  .populate('users')
    .sort({ date: -1 })
    .skip(10 * (req.body.pageNumber-1))
    .limit(10)
    .then(posts =>{ 
      Post.find({
        $or:[
          {service: {$ne:''}},
          {sharePrice: {$ne:''}}
        ]
       }).countDocuments().then(count =>{
        data = {};
        data['posts'] = posts;
        data['count'] = count;
        res.json(data)
      });
      
    })
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
}
});

router.post('/forInvestor', (req, res) => {
  if (is_Empty( req.body) ){
    Post.find({
       sharePrice: {$ne:''}
     
    })
    .populate('users')
      .sort({ date: -1 })
      .skip(0)
      .limit(10)
      .then(posts => {
        Post.find({
            sharePrice: {$ne:''}
         }).countDocuments().then(count =>{
          data = {};
          data['posts'] = posts;
          data['count'] = count;
          
          res.json(data)
        });
      })
      .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
}
else{
  Post.find({
    $or:[
      {service: {$ne:''}},
      {sharePrice: {$ne:''}}
    ]
  })
  .populate('users')
    .sort({ date: -1 })
    .skip(10 * (req.body.pageNumber-1))
    .limit(10)
    .then(posts =>{ 
      Post.find({
        $or:[
          {service: {$ne:''}},
          {sharePrice: {$ne:''}}
        ]
       }).countDocuments().then(count =>{
        data = {};
        data['posts'] = posts;
        data['count'] = count;
        res.json(data)
      });
      
    })
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
}
});

router.post('/forPitcher', (req, res) => {
  if (is_Empty( req.body.pageNumber) ){
    Post.find({
       user:req.body.id
     
    })
    .populate('users')
      .sort({ date: -1 })
      .skip(0)
      .limit(10)
      .then(posts => {
        Post.find({
            sharePrice: {$ne:''}
         }).countDocuments().then(count =>{
          data = {};
          data['posts'] = posts;
          data['count'] = count;
          
          res.json(data)
        });
      })
      .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
}
else{
  Post.find({
    $or:[
      {service: {$ne:''}},
      {sharePrice: {$ne:''}}
    ]
  })
  .populate('users')
    .sort({ date: -1 })
    .skip(10 * (req.body.pageNumber-1))
    .limit(10)
    .then(posts =>{ 
      Post.find({
        $or:[
          {service: {$ne:''}},
          {sharePrice: {$ne:''}}
        ]
       }).countDocuments().then(count =>{
        data = {};
        data['posts'] = posts;
        data['count'] = count;
        res.json(data)
      });
      
    })
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
}
});

router.post('/search', (req, res) => {
  Post.find({title:{ '$regex': `(^${req.body.key})`, '$options': 'i' }})
  .populate('users')
    .sort({ date: -1 })
    .limit(100)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/addPost',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    Profile.findOne({user: req.body.user})
    .then(profileFound=> 
      {
        if(!profileFound)
        {
          res.json({response:"You must make a profile to add a post!"})
        }
        else
        {
          // Check Validation
          if (!isValid) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
          }

          const newPost = {};
            newPost.description= req.body.description;
            newPost.username= req.body.username;
            newPost.title= req.body.title;
            newPost.avatar= req.body.avatar;
            newPost.user= req.user.id;
            newPost.service= req.body.service;
            newPost.servicePrice= req.body.servicePrice;
            newPost.sharePrice=req.body.sharePrice;
            newPost.sharesToSale=req.body.sharesToSale;

        
          new Post(newPost).save().then(post => res.json(post)).catch(err => res.status(404).json(err));
        }
      })
    
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this post' });
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

//create Request
router.post(
  '/request',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRequestInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    User.findOne({_id:req.body.buyerId})
    .then(buyer => {
      if(!buyer){
        res.json({message:'Buyer not found'});
      }
      else{
        let balance = parseInt(buyer.balance);
        let amount = parseInt(req.body.amount);
      if(balance >= amount){
        
      balance = balance - amount;
      buyer.balance = balance.toString();
      buyer.save();
      
      const newRequest = {};
      newRequest.buyerId= req.body.buyerId;
      newRequest.sellerId= req.body.sellerId;
      newRequest.postId= req.body.postId;
      newRequest.shares= req.body.shares;
      newRequest.amount= req.body.amount;  

    new Request(newRequest).save()
    .then(request2 => {
      res.json({balance: buyer.balance})
    })
    .catch(err => console.log(err));
      }
      else {
        
        res.json({message:'This buyer has low balance'});
      }}
    })
    .catch(err => res.status(404).json({ request: 'There are no buyer of this id' }))
    
  }
);

router.post(
  '/serviceRequest',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    User.findOne({_id:req.body.buyerId})
    .then(buyer => {
      if(!buyer){
        res.json({message:'Buyer not found'});
      }
      else{
      
      const newRequest = {};
      newRequest.buyerId= req.body.buyerId;
      newRequest.sellerId= req.body.sellerId;
      newRequest.postId= req.body.postId;
      newRequest.message= req.body.message;
      newRequest.servicePrice= req.body.servicePrice;  

    new Request(newRequest).save()
    .then(request2 => {
      res.json({response: 'Request Sent Sucessfully'})
    })
    .catch(err => console.log(err));
     }
    })
    .catch(err => res.status(404).json({ request: 'There are no buyer of this id' }))
    
  }
);

//Get all requests
router.get('/requests/all', (req, res) => {
  const errors = {};

  Request.find()
    .then(requests => {
      if (!requests) {
        errors.noprofile = 'There are no requests';
        return res.status(404).json(errors);
      }

      //res.json(requests);
    })
    .catch(err => res.status(404).json({ request: 'There are no requests' }));
});

//by id( for specific user)
router.post('/requests/all/byId', (req, res) => {
  const errors = {};
  Request.find( {$or: [{sellerId:req.body.userId},{buyerId:req.body.userId}]})
  .populate('buyerId')
  .populate('postId')
  .sort({ date: -1 })
    .then(requests => {
      if (!requests) {
        errors.noprofile = 'There are no requests';
        return res.status(404).json(errors);
      }

      res.json(requests);
    })
    .catch(err => res.status(404).json({ request: 'There are no requests' }));
});

//accept Request update
router.post(
  '/acceptServiceRequest',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Request.findOneAndDelete({_id:req.body._id}).then(reqq =>{})
    
    User.findOne({_id: req.body.sellerId})
    .then(seller => {
      if(!seller){
        res.json({response:'seller not found'});
      } 
      else{
        
        let balance = parseInt(seller.balance);
        let amount = parseInt(req.body.servicePrice);
      if(balance >= amount){
      balance = balance - amount;
      seller.balance = balance.toString();
     
      seller.save().then(user => {
        User.findOne({_id:req.body.buyerId})
        .then(buyer => {
           if(!buyer){
            res.json({response:'buyer not found'});
                      }
          else{
              let balance = parseInt(buyer.balance);
              let amount = parseInt(req.body.servicePrice);

            balance = balance + amount;
            buyer.balance = balance.toString();
            buyer.save().then(user =>
            res.json({response:'Amount paid sucessfully!'}))
            .catch(err => res.status(404).json({ balance: 'Refresh' }));
              }
 }
)
        .catch(err => res.status(404).json({ balance: 'Refresh' }));
      })
      .catch(err => res.status(404).json({ balance: 'Refresh' }));
        }
        else{
          res.json({response:'You do not have enough balance to accept this request'});
        }
            }
       }
 );
      
  }
);

router.post(
  '/acceptRequest',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
    Post.findOne({ _id: req.body.postId }).then(post => {
      const newShareHolder = {
        userId: req.body.buyerId,
        sharesPurchased: req.body.shares,
      };
      const totalShares = parseFloat(req.body.shares) + parseFloat(post.sharesSold);
      post.sharesSold= totalShares ;


      User.findOne({_id:req.body.sellerId})
    .then(seller => {
      if(!seller){
        res.json({message:'seller not found'});
      }
      else{
        let balance = parseInt(seller.balance);
        let amount = parseInt(req.body.amount);
      if(balance >= amount){
        
      balance = balance + amount;
      seller.balance = balance.toString();
      
      
      //Add to shareHolder to array
      post.shareHolders.unshift(newShareHolder);
      post.save().then(post =>{
        Request.findOneAndDelete({_id:req.body._id}).then(request =>
        {});
      });
      seller.save().then(user =>
        res.json(user.balance))
      .catch(err => res.status(404).json({ balance: 'Refresh' }));}
      
      }})
      
    });
  }
);


//reject Request 
router.post(
  '/rejectRequest',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Request.findOneAndDelete({_id:req.body.id})
    .then(reqt => {
      
      User.findOne({_id:req.body.buyer})
    .then(buyer => {
      
      if(!buyer){
        res.json({message:'buyer not found'});
      }
      else{
        let balance = parseInt(buyer.balance);
        let amount = parseInt(req.body.amount);
        
        
      balance = balance + amount;
      buyer.balance = balance.toString();
        buyer.save().then(user =>
          
          res.json(user.balance))
        .catch(err => res.status(404).json({ balance: 'Refresh' }));
      
      }})
      .catch(err => res.status(404).json(err));
    });
    
  }
);
router.post(
  '/rejectServiceRequest',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Request.findOneAndDelete({_id:req.body.id})
    .then(reqt => {
      res.json({response:'Request rejected!'});
    })
    .catch(err => {res.status(404).json(err)});
    
  }
);

module.exports = router;

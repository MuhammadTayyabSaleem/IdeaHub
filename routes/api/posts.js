const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

const Request = require('../../models/Request');

// Validation
const validatePostInput = require('../../validation/post');
const validateCommentInput = require('../../validation/comment');
const validateRequestInput = require('../../validation/request');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
  .populate('users')
    .sort({ date: -1 })
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
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

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
      if(req.body.sharePrice) newPost.sharePrice=req.body.sharePrice;
    

    new Post(newPost).save().then(post => res.json(post));
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

    const newRequest = {};
      newRequest.buyerId= req.body.buyerId;
      newRequest.sellerId= req.body.sellerId;
      newRequest.postId= req.body.postId;
      newRequest.shares= req.body.shares;
      newRequest.amount= req.body.amount;    
    new Request(newRequest).save()
    .then(request2 => res.json(request2))
    .catch(err => console.log(err));
  }
);

//Get all requests
router.get('/requests/all', (req, res) => {
  const errors = {};

  Request.find()
    .then(requests => {
      console.log('hello');
      if (!requests) {
        errors.noprofile = 'There are no requests';
        return res.status(404).json(errors);
      }

      //res.json(requests);
    })
    .catch(err => res.status(404).json({ request: 'There are no requests' }));
});

//by id
router.post('/requests/all/byId', (req, res) => {
  const errors = {};
  Request.find({sellerId:req.body.userId})
  .populate('buyerId')
  .populate('postId')
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
      
      
      //Add to shareHolder to array
      post.shareHolders.unshift(newShareHolder);
      post.save().then(post =>
        Request.findOneAndDelete({_id:req.body._id}),
        res.json(post));
      
      
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
      res.json(reqt);
    });
    
  }
);

module.exports = router;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
import Spinner from '../common/Spinner';
import { getPost } from '../../actions/postActions';
import isEmpty from '../../validation/is-empty';
import {BroadcastNewMessage} from '../../actions/chatAction2';
import Push from 'push.js';
import img from '../../img/msg.png';
import {setNewMessage} from '../../actions/chatAction2';

class Post extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
    this.props.BroadcastNewMessage();

  }

  render() {
    const {newMessage} = this.props.chat;
    
    if(isEmpty(newMessage)){}
    else

    {
      Push.create("Idea Hub", {
        body: `You have a new message from \n${newMessage.from.name}: \n ''${newMessage.message}''` ,
        icon: img,
        onClick: function () {
          window.location.href = "http://localhost:3000/inbox";
            this.close();
        }
    });
    this.props.setNewMessage();
      }

    const { post, loading } = this.props.post;
    let postContent;

    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {
      postContent = (
        <div>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <CommentFeed postId={post._id} comments={post.comments} />
        </div>
      );
    }

    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">
                Back To Feed
              </Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  BroadcastNewMessage: PropTypes.func.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  chat: state.chat
});

export default connect(mapStateToProps, { BroadcastNewMessage,setNewMessage,getPost })(Post);

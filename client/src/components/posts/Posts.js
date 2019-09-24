import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostForm from './PostForm';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPosts } from '../../actions/postActions';

class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { posts, loading } = this.props.post;
    const {user} = this.props.auth;
    let postContent;

    if (posts === null || loading) {
      postContent = <Spinner />;
    } else {

      if(user.type === 'ideaPitcher'){
        
        postContent = 
        <div>
        <PostForm />
        <PostFeed posts={posts} /></div>;
      }
      else{
        postContent = <div>

        <h1 className='text-center'>Idea Feed</h1>
        <br/><br/>
        <PostFeed posts={posts} />
        </div>  ;
      }
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, { getPosts })(Posts);

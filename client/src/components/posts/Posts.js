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
      if(posts.length < 1 && user.type === 'ideaPitcher' )
      {
        postContent =
        <div>
        <p className="lead text-center">
                Share an idea and get Investors and Developers
              </p>
        <PostForm />
        <h3>No posts Found!</h3>
        </div>
      }
      else if(posts.length < 1 && user.type != 'ideaPitcher')
      {
        postContent =
        <div>
          <p className="lead text-center">
                Invest in new Ideas or Privide Service
              </p>
        <h3>No posts Found!</h3>
        </div>
      }
      else{
      if(user.type === 'ideaPitcher'){
        
        postContent = 
        <div>
          <p className="lead text-center">
                Share an idea and get Investors and Developers
              </p>
        <PostForm />
        <PostFeed posts={posts} /></div>;
      }
      else{
        postContent = <div>
        <p className="lead text-center">
                Invest in new Ideas or Privide Service
              </p>
        <br/><br/>
        <PostFeed posts={posts} />
        </div>  ;
      }}
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
            <h1 className='display-4 text-center'>Idea Feed</h1>
            
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

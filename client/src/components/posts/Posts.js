import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostForm from './PostForm';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPostsForDeveloper,getPostsForInvestor,getPostsForPitcher,searchPosts } from '../../actions/postActions';
import Pagination from 'react-js-pagination'; 
import isEmpty from '../../validation/is-empty';
import {BroadcastNewMessage} from '../../actions/chatAction2';
import Push from 'push.js';
import img from '../../img/msg.png';
import {setNewMessage} from '../../actions/chatAction2';



class Posts extends Component {
  constructor(){
    super();
    this.state = {
      search: '',
      activePage: 1 
    };
    this.onChange = this.onChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  componentDidMount() {
    this.props.BroadcastNewMessage();

    if(this.props.auth.user.type == 'developer'){
    this.props.getPostsForDeveloper();
    }
    else if(this.props.auth.user.type == 'investor'){
      this.props.getPostsForInvestor();
      }
    else {
      const key={}
      key['id']=this.props.auth.user.id
      this.props.getPostsForPitcher(key);
      }
  }
  handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber});
    let page={};
    page['pageNumber']=pageNumber;
    if(this.props.auth.user.type == 'developer'){
      this.props.getPostsForDeveloper(page);
      }
    else if(this.props.auth.user.type == 'investor'){
      this.props.getPostsForInvestor(page);
      }
      else {
        page['id']=this.props.auth.user.id;
        this.props.getPostsForPitcher(page);
        }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    let key={};
    
    key['key'] = e.target.value;
    this.props.searchPosts(key);
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
          <center>
              <form onSubmit={this.onSubmit} style={{width:'50%'}}>
              <input
                
                className='form-control form-control-lg'
                placeholder="Search by name"
                name="search"
                type="text"
                value={this.state.search}
                onChange={this.onChange}
              />
              </form>
              </center>
          <p className="lead text-center">
                Invest in new Ideas or Provide Service
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
          <center>
              <form onSubmit={this.onSubmit} style={{width:'50%'}}>
              <input
                
                className='form-control form-control-lg'
                placeholder="Search by name"
                name="search"
                type="text"
                value={this.state.search}
                onChange={this.onChange}
              />
              </form>
              </center>
        <p className="lead text-center">
                Invest in new Ideas or Provide Service
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
                
               <Pagination
                 
                 activePage={this.state.activePage}
                 itemsCountPerPage={10}
                 totalItemsCount={this.props.post.count}
                 pageRangeDisplayed={5}
                 onChange={this.handlePageChange}
                 
               />
            
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getPostsForDeveloper: PropTypes.func.isRequired,
  getPostsForInvestor: PropTypes.func.isRequired,
  getPostsForPitcher: PropTypes.func.isRequired,
  searchPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  BroadcastNewMessage: PropTypes.func.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  chat: state.chat

});

export default connect(mapStateToProps, { BroadcastNewMessage,setNewMessage,getPostsForDeveloper,getPostsForInvestor,getPostsForPitcher,getPostsForInvestor,searchPosts })(Posts);

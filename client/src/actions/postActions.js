import axios from 'axios';

import {
  ADD_POST,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  GET_REQUESTS,
  REQUEST_LOADING,
  DELETE_POST,
  DELETE_REQUEST,
  UPDATE_BALANCE,
  SET_CURRENT_USER,
  GET_BALANCE,
  ADD_POST_COUNT
} from './types';


// Add Post
export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  axios
    .post('/api/posts/addPost', postData)
    .then(res =>{
      if(res.data.response)
      {
        window.alert(res.data.response);
      }
      else{
      dispatch({
        type: ADD_POST,
        payload: res.data
      })}}
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Posts
export const getPostsForDeveloper = data => dispatch => {
  dispatch(setPostLoading());
  axios
    .post('/api/posts/forDeveloper',data)
    .then(res =>{
      dispatch({
        type: GET_POSTS,
        payload: res.data.posts
        
      })
      dispatch({
        type: ADD_POST_COUNT,
        payload: res.data.count
        
      })
    }
      
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

export const getPostsForInvestor = data => dispatch => {
  dispatch(setPostLoading());
  axios
    .post('/api/posts/forInvestor',data)
    .then(res =>{
      dispatch({
        type: GET_POSTS,
        payload: res.data.posts
        
      })
      dispatch({
        type: ADD_POST_COUNT,
        payload: res.data.count
        
      })
    }
      
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

export const getPostsForPitcher = data => dispatch => {
  dispatch(setPostLoading());
  axios
    .post('/api/posts/forPitcher',data)
    .then(res =>{
      dispatch({
        type: GET_POSTS,
        payload: res.data.posts
        
      })
      dispatch({
        type: ADD_POST_COUNT,
        payload: res.data.count
        
      })
    }
      
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

export const searchPosts = key => dispatch => {
    axios
    .post('/api/posts/search',key)
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get Post
export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

// Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Like
export const addLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => dispatch(getPostsForDeveloper()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Like
export const removeLike = id => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then(res => dispatch(getPostsForDeveloper()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Comment
export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get all requests by id (for specific user)
export const getRequests = (userId) => dispatch => {
  dispatch(setRequestLoading());
  axios
    .post('/api/posts/requests/all/byId', userId)
    .then(res =>{
      dispatch({
        
        type: GET_REQUESTS,
        payload: res.data
      })}
    )
    .catch(err =>
      dispatch({
        type: GET_REQUESTS,
        payload: null
      })
    );
};

//accept request update post
export const acceptRequestUpdatePost = (requestData) => dispatch => {
  if(window.confirm('Are you sure you want to accept that request?')){
  axios
    .post('/api/posts/acceptRequest', requestData)
    .then(res =>{
      window.alert("Request Accepted successfully");
      dispatch({
        type: DELETE_REQUEST,
        payload: requestData._id
      })
      dispatch({
        type: UPDATE_BALANCE,
        payload: res.data.balance
      });
      }
    )
    .catch(err =>
      dispatch({
        type: GET_REQUESTS,
        payload: null
      })
    );}
};

export const acceptServiceRequest = (requestData) => dispatch => {
  if(window.confirm('Are you sure you want to accept that service request?')){
  axios
    .post('/api/posts/acceptServiceRequest', requestData)
    .then(res =>{
      window.alert(res.data.response);
      dispatch({
        type: DELETE_REQUEST,
        payload: requestData._id
      })
      dispatch({
        type: DELETE_REQUEST,
        payload: res.data.balance
      });
      }
    )
    .catch(err =>
      dispatch({
        type: GET_REQUESTS,
        payload: null
      })
    );}
};

//reject request 
export const rejectRequest = (id) => dispatch => {
  if(window.confirm('Are you sure you want to reject that request?')){
  axios
    .post('/api/posts/rejectRequest', id)
    .then(res =>{
      dispatch({
        type: DELETE_REQUEST,
        payload: id.id
      })
      }
    )
    .catch(err =>
      dispatch({
        type: GET_REQUESTS,
        payload: null
      })
    );}
};

export const rejectServiceRequest = (id) => dispatch => {
  if(window.confirm('Are you sure you want to reject service request?')){
  axios
    .post('/api/posts/rejectServiceRequest', id)
    .then(res =>{
      dispatch({
        type: DELETE_REQUEST,
        payload: id.id
      })
      }
    )
    .catch(err =>
      dispatch({
        type: GET_REQUESTS,
        payload: null
      })
    );}
};

export const chatServiceRequest = (id) => dispatch => {
  console.log(id);
  if(window.confirm('chat')){
  axios
    .post('/api/posts/rejectRequest', id)
    .then(res =>{
      dispatch({
        type: DELETE_REQUEST,
        payload: id.id
      })
      }
    )
    .catch(err =>
      dispatch({
        type: GET_REQUESTS,
        payload: null
      })
    );}
};

//make Request
export const makeRequest = (requestData) => dispatch => {
  
  axios
  .post('/api/posts/request', requestData)
  .then(res => {
    window.alert('Request sent sucessfully!');
    dispatch({
      type: GET_BALANCE,
      payload: res.data.balance
      })
      })
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
    })
  );
};
export const makeServiceRequest = (requestData) => dispatch => {
  
  axios
  .post('/api/posts/serviceRequest', requestData)
  .then(res => {
    window.alert('Request sent sucessfully!');
   
      })
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
    })
  );
};

// Set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};
export const setRequestLoading = () => {
  return {
    type: REQUEST_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

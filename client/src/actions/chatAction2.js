import {
  ADD_CHAT,
  GET_CHATS,
  GET_CHAT,
  CHAT_LOADING,
  NEW_MESSAGE
} from './types';
import axios from 'axios';
import io from 'socket.io-client';
import React from 'react';
import { useSelector } from 'react-redux';
import Push from 'push.js'
import img from '../img/msg.png'

 let socket; 
if(!socket){
  socket = io(':3001');
}



export const Broadcast= () => dispatch => {
  socket.removeListener('data.user1');
  socket.on('data.user1',(msg)=>{
 
  console.log()
  dispatch({
    type: ADD_CHAT,
    payload: msg
  })
  dispatch({
    type: NEW_MESSAGE,
    payload: msg
  })    
  })
  
  
  }
  export const BroadcastNewMessage= () => dispatch => {
    socket.removeListener('data.user1');
    socket.on('data.u ser1',(msg)=>{
    
    dispatch({
      type: NEW_MESSAGE,
      payload: msg
    })    
    })
    
    
    }


export const addChat= data => dispatch => {

    axios
      .post('/api/chats/',data)
      .then(res =>{
        
        let userData={}
        userData.user1=data.user1;
        userData.user2=data.user2;
        
        socket.emit('chat Message',data);
        
      
    
   })
      .catch(err =>
        dispatch({
          type: ADD_CHAT,
          payload: null
        })
      );
    }
    

export const setChatLoading = () => {
  return {
    type: CHAT_LOADING
  };
};
export const setNewMessage = () => {
  return {
    type: NEW_MESSAGE,
    payload:{}
  };
};

export const getChats = user => dispatch => {
  dispatch(setChatLoading());
  axios
    .post('/api/chats/getChats',user)
    .then(res =>
      dispatch({
        type: GET_CHATS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CHATS,
        payload: null
      })
    );
};
export const getChat = data => dispatch => {
  dispatch(setChatLoading());
  axios
    .post('/api/chats/getChat',data)
    .then(res =>{
      
      dispatch({
        type: GET_CHAT,
        payload: res.data
      })})

    .catch(err =>
      dispatch({
        type: GET_CHAT,
        payload: null
      })
    );
};
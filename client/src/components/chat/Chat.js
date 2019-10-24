import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {addChat,getChat,Broadcast} from '../../actions/chatAction2';
import Spinner from '../common/Spinner';
import isEmpty from '../../validation/is-empty';
// eslint-disable-next-line
import axios from 'axios';
import chatCSS from './chat.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class Chat extends Component {
  
  constructor() {
    super();
    this.state = { 
      textMessage: "",
    };

    this.onChange = this.onChange.bind(this); 
    
    
    }
  
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    if (this.props.match.params.handle) {
      let user={}
      user.user1=this.props.match.params.handle;
      user.user2=this.props.match.params.handle2;
      this.props.getChat(user);
    }
    this.props.Broadcast();
    
  }
  onClick(e){
    if(this.state.textMessage === ""){}
    else{
    let data={};
      this.props.addChat({
      user1:this.props.match.params.handle,
      user2:this.props.match.params.handle2,
      message:this.state.textMessage,
      chatId:this.props.chat.chatArray._id,
      from:{name:this.props.auth.user.name,avatar:this.props.auth.user.avatar}
    })
     this.state.textMessage=''; 
  }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chat.chatArray.chat === null && this.props.chat.loading) {
      this.props.history.push('/not-found');
    }
  }

  render() {
    const { chats,loading,chatArray} = this.props.chat;
    let display;
    let chatWindow;
  
    if ( loading || isEmpty(chatArray)) {
      display = <Spinner />;

    } else {
      
      
    display = 
    <div>
      <Paper className='root'>
        <div style={{marginLeft:'50px'}}>
        <center>
          <Typography variant="h4" component="h4">
            Chat App
          </Typography>
          <Typography variant="h5" component="h5">
            Name of the chats
          </Typography>
        </center>
        <br/>
        <div className='chatWindow' style={{height:'400px', overflow:'auto',width:'60%',marginLeft:'21%'}}>
          {
            chatArray.chat.map((chat_i,i) => (
              <div  key={i}> 
                <Chip avatar={<Avatar src={chat_i.from.avatar} />} label={chat_i.from.name} className='Chip' />
                
                <Typography varient='p' style={{overflowWrap:'break-word', marginLeft:'15px'}}>
                  {chat_i.message}
                </Typography>
              </div>
              ))        
          }   
          
          
          
              </div>
        <center>
        <div className='flex' style={{width:"60%"}}>

              <TextField style={{width:'80%'}}
                label="Send a Chat..."
                className='chatBox'
                value={this.state.textMessage}
                onChange={this.onChange} 
                name='textMessage'
              />
          
              <Button style={{width:'18%',marginTop:'10px',marginLeft:'5px'}}
                variant="contained"
                color="primary"
                className='sendButton'
                onClick={this.onClick.bind(this)}>
                  Send
              </Button>
              </div></center>
        </div>
      </Paper>
    </div>
    }


    return (
      <div>
            {display}
            </div>
    );
  
  }
  
}
Chat.propTypes = {
  getChat: PropTypes.func.isRequired,
  addChat: PropTypes.func.isRequired,
  Broadcast:PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  chat: state.chat,
  chatArray: state.chat.chat,
  auth: state.auth
});
export default connect(mapStateToProps, { getChat, addChat,Broadcast})(Chat);
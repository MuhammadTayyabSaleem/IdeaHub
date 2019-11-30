import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from '../../validation/is-empty';
import {getChats} from '../../actions/chatAction2';
import Spinner from '../common/Spinner';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';



class Inbox extends Component {
  

  componentDidMount() {
    let user={}
    user.userId=this.props.auth.user.id;
    this.props.getChats(user);
  }

  render() {
    const { chats ,loading } = this.props.chat;

    let display;

    if ( loading ) {
      display = <Spinner />;
    } 
    else 
    {
      if(isEmpty(chats))
      {
        console.log('found in');
        display=
        <div className="profiles">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
          <Paper className='root' >
            <h1 className="display-4 text-center">Inbox</h1>
            <p className="lead text-center">
              Chat and connect with people
            </p>
            <h3>Inbox is empty!</h3>
            </Paper>
          </div>
        </div>
      </div>
    </div>
        return display;
      }
      
      let show;
      display = chats.map((chat,i) => (
        <div key={i}>
        {(() => {
          
          if(this.props.auth.user.id === chat.user1._id){
        show=    
        <center>
      <div className="card card-body bg-light mb-3" style={{width:'97%'}}>
      <div className="row">
        <div className="col-2">
          <img src={chat.user2.avatar} alt="" className="rounded-circle" />
        </div>
        <div >
          <h3>{chat.user2.name}</h3>
          <Link to={`/chat/${chat.user1._id}/${chat.user2._id}`} className="btn btn-info">
            Chat
          </Link>
         
        </div>
      </div>
    </div>
    </center>
      return show;
      }
          
          else{
            show=
            <center>
      <div className="card card-body bg-light mb-3" style={{width:'97%'}}>
      <div className="row">
        <div className="col-2">
          <img src={chat.user1.avatar} alt="" className="rounded-circle" />
        </div>
        <div >
          <h3>{chat.user1.name}</h3>
          <Link to={`/chat/${chat.user2._id}/${chat.user1._id}`} className="btn btn-info">
            Chat
          </Link>
        </div>
      </div>
    </div>
    </center>
    return show;
          }
        })()}
        
      </div>))
    }
    return (
      <div className="profiles">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
          <Paper className='root' >
            <h1 className="display-4 text-center">Inbox</h1>
            <p className="lead text-center">
              Chat and connect with people
            </p>
            {display}
            </Paper>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

Inbox.propTypes = {
  getChats: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  chat: state.chat,
  auth: state.auth
});
export default connect(mapStateToProps, { getChats})(Inbox);

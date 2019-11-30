import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import RequestItem from './RequestItem';
import { getRequests } from '../../actions/postActions';
import {setNewMessage} from '../../actions/chatAction2';
import isEmpty from '../../validation/is-empty';
import {BroadcastNewMessage} from '../../actions/chatAction2';
import Push from 'push.js';
import img from '../../img/msg.png';

class Requests extends Component {
  componentDidMount() {
    const id= {userId:this.props.auth.user.id}
    this.props.getRequests(id);
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
    const { requests, loading } = this.props.request;
    let requestItems;

    if (requests === null || loading ) {
      requestItems = <Spinner />;
    } else {
      
      if (requests.length > 0) {
        requestItems = requests.map(request => (
          
          <RequestItem key={request._id} request={request} />
        ));
      } else {
        requestItems = <h4>No requests found...</h4>;
      }
    }

    return (
      <div className="requests">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Buyer Requests!</h1>
              <p className="lead text-center">
                Accept or reject the request.
              </p>
              {requestItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Requests.propTypes = {
  getRequests: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  BroadcastNewMessage: PropTypes.func.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired,
  requests: PropTypes.array.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  request: state.request,
  auth: state.auth,
  chat: state.chat
});

export default connect(mapStateToProps, { BroadcastNewMessage,setNewMessage,getRequests })(Requests);

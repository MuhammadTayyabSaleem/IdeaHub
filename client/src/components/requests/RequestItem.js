

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import img from '../../img/request.jpg';
import { acceptRequestUpdatePost,rejectRequest,acceptServiceRequest,rejectServiceRequest,chatServiceRequest } from '../../actions/postActions';
import { connect } from 'react-redux';
import { getBalance } from '../../actions/authActions';
import {Link} from 'react-router-dom'


class RequestItem extends Component {
  
  
  acceptRequest(id)
    {
      const acceptRequest={
        buyerId:this.props.request.buyerId,
        sellerId:this.props.request.sellerId,
        postId:this.props.request.postId,
        shares:this.props.request.shares,
        amount:this.props.request.amount,
        _id:id
      }
      this.props.acceptRequestUpdatePost(acceptRequest);
      this.props.getBalance({id: this.props.auth.user.id});

    }
    rejectRequest(id)
    {
      const requestId={
        id:this.props.request._id,
        buyer:this.props.request.buyerId._id,
        amount: this.props.request.amount
      }
      this.props.rejectRequest(requestId);
    }
    acceptServiceRequest(iden){
      
      const acceptRequest={
        buyerId:this.props.request.buyerId._id,
        sellerId:this.props.request.sellerId,
        servicePrice:this.props.request.servicePrice,
        _id:iden
      }
      this.props.acceptServiceRequest(acceptRequest);
      this.props.getBalance({id: this.props.auth.user.id});
    }
    rejectServiceRequest(iden){
      let data={};
      data['id']=iden;
      this.props.rejectServiceRequest(data);
    }
    chatServiceRequest(iden){
      let data={};
      data['id']=iden;
      this.props.chatServiceRequest(data);
    }
  
  render() {
    const { request } = this.props;
    let requestView;
    if(request.sellerId === this.props.auth.user.id){
    if(request.shares !==''){
    requestView = <div className="row" >
    <div className="col-md-2">
      <a href="profile.html">
        <img
          className="rounded-circle d-none d-md-block"
          src={img}
          alt=""
        />
      </a>
      
      <h5 className="text-center">{request.postId.title}</h5>
    </div>
    <div className="col-md-5">
      <h4 >{request.buyerId.name}</h4>
      <p>{request.buyerId.name} wants to buy {request.shares}% shares for ${request.amount}</p>
    </div>
    
    <div className="col-md-5">
    <center>
      <button className='m-4 btn-success btn' onClick={this.acceptRequest.bind(this, request._id)} >✔ Accept</button>
      <button className='m-4 btn-danger btn' onClick={this.rejectRequest.bind(this, request._id)}>✘ Reject</button>
      </center> 
    </div>          

  </div>
    }
    else if(request.sharePrice !==''){
      requestView = <div className="row" >
      <div className="col-md-2">
        <a href="profile.html">
          <img
            className="rounded-circle d-none d-md-block"
            src={img}
            alt=""
          />
        </a>
        
        <h5 className="text-center">{request.postId.title}</h5>
      </div>
      <div className="col-md-5">
        <h4 >{request.buyerId.name}</h4>
        <p>Message: {request.message}</p>
        <p>Service Price: ${request.servicePrice}</p>
      </div>
      
      <div className="col-md-5">
      <center>
        <button className='m-2 btn-success btn' onClick={this.acceptServiceRequest.bind(this, request._id)} >✔ Accept</button>
        <Link to={`/chat/${request.sellerId}/${request.buyerId._id}`}>
        <button className='m-1 btn-warning btn-lg' >Chat</button>
        </Link>
        <button className='m-2 btn-danger btn' onClick={this.rejectServiceRequest.bind(this, request._id)}>✘ Reject</button>
        </center> 
      </div>          
  
    </div>
    }
      

    return (
      <div className="card card-body mb-3 " style={{background:'#F8F8FF'}}>
        {requestView}
      </div>
    );
  }
  else{
    if(request.shares !==''){
    requestView = <div className="row" >
    <div className="col-md-2">
      <a href="profile.html">
        <img
          className="rounded-circle d-none d-md-block"
          src={img}
          alt=""
        />
      </a>
      
      <h5 className="text-center">{request.postId.title}</h5>
    </div>
    <div className="col-md-5">
      <h4 >{request.buyerId.name}</h4>
      <p>{request.buyerId.name} wants to buy {request.shares}% shares for ${request.amount}</p>
    </div>
    
    <div className="col-md-5">
    <center>
      <button className='m-4 btn-danger btn' onClick={this.rejectRequest.bind(this, request._id)}>✘ Reject</button>
      </center> 
    </div>          

  </div>
    }
    else if(request.sharePrice !==''){
      requestView = <div className="row" >
      <div className="col-md-2">
        <a href="profile.html">
          <img
            className="rounded-circle d-none d-md-block"
            src={img}
            alt=""
          />
        </a>
        
        <h5 className="text-center">{request.postId.title}</h5>
      </div>
      <div className="col-md-5">
        <h4 >{request.buyerId.name}</h4>
        <p>Message: {request.message}</p>
        <p>Service Price: ${request.servicePrice}</p>
      </div>
      
      <div className="col-md-5">
      <center>
        
        
        <button className='m-2 btn-danger btn' onClick={this.rejectServiceRequest.bind(this, request._id)}>✘ Reject</button>
        </center> 
      </div>          
  
    </div>
    }
      

    return (
      <div className="card card-body mb-3 " style={{background:'#F8F8FF'}}>
        {requestView}
      </div>
    );
  }
  }
}

RequestItem.propTypes = {
  request: PropTypes.object.isRequired,
  requests: PropTypes.array.isRequired,
  acceptRequestUpdatePost: PropTypes.func.isRequired,
  acceptServiceRequest: PropTypes.func.isRequired,
  rejectServiceRequest: PropTypes.func.isRequired,
  chatServiceRequest: PropTypes.func.isRequired,
  rejectRequest: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { acceptRequestUpdatePost,getBalance,rejectRequest,acceptServiceRequest,rejectServiceRequest,chatServiceRequest })(
  RequestItem
);

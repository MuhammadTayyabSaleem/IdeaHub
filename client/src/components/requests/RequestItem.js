

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import img from '../../img/request.jpg';
import { acceptRequestUpdatePost,rejectRequest } from '../../actions/postActions';
import { connect } from 'react-redux';


class RequestItem extends Component {
  
  
  acceptRequest(id)
    {
      const acceptRequest={
        buyerId:this.props.request.buyerId,
        sellerId:this.props.request.sellerId,
        postId:this.props.request.postId,
        shares:this.props.request.shares,
        amount:this.props.request.amount,
        _id:this.props.request._id
      }
      this.props.acceptRequestUpdatePost(acceptRequest);
    }
    rejectRequest(id)
    {
      const requestId={
        id:this.props.request._id
      }
      this.props.rejectRequest(requestId);
    }
  
  render() {
    const { request } = this.props;
    

    return (
      <div className="card card-body mb-3 " style={{background:'#F8F8FF'}}>
        <div className="row" >
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
            <p>{request.buyerId.name} wants to buy {request.shares}% shares for {request.amount}Rs/-</p>
          </div>
          
          <div className="col-md-5">
          <center>
            <button className='m-4 btn-success btn' onClick={this.acceptRequest.bind(this, request._id)} >✔ Accept</button>
            <button className='m-4 btn-danger btn' onClick={this.rejectRequest.bind(this, request._id)}>✘ Reject</button>
            </center> 
          </div>           

        </div>
      </div>
    );
  }
}

RequestItem.propTypes = {
  request: PropTypes.object.isRequired,
  requests: PropTypes.array.isRequired,
  acceptRequestUpdatePost: PropTypes.func.isRequired,
  rejectRequest: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { acceptRequestUpdatePost,rejectRequest })(
  RequestItem
);

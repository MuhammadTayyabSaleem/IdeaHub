import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import RequestItem from './RequestItem';
import { getRequests } from '../../actions/postActions';
import isEmpty from '../../validation/is-empty'

class Requests extends Component {
  componentDidMount() {
    const id= {userId:this.props.auth.user.id}
    this.props.getRequests(id);
  }

  render() {
   
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
  auth:PropTypes.object.isRequired,
  requests: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  request: state.request,
  auth: state.auth
});

export default connect(mapStateToProps, { getRequests })(Requests);

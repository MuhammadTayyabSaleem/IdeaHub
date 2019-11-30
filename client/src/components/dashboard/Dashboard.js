import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profileAction';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';
import Experience from './Experience';
import Education from './Education';
import { getBalance } from '../../actions/authActions';
import {setNewMessage} from '../../actions/chatAction2';
import isEmpty from '../../validation/is-empty';
import {BroadcastNewMessage} from '../../actions/chatAction2';
import Push from 'push.js';
import img from '../../img/msg.png';


class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getBalance({id: this.props.auth.user.id});
    this.props.BroadcastNewMessage();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashboardContent;
    const {newMessage} = this.props.chat;
    
    if(isEmpty(newMessage)){}
    else

    {
      Push.create("Idea Hub", {
        body: `You have a new message from \n${newMessage.from.name}: \n ''${newMessage.message}''` ,
        icon: img,
        onClick: function () {
          //window.open('http://localhost:3000/inbox');
          window.location.href = `http://localhost:3000/chat/${newMessage.user1}/${newMessage.user2}`;
            this.close();
        }
    });
    this.props.setNewMessage()
      }

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              Welcome <Link to={`/profile/${profile.username}`}>{user.name}</Link>
            </p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div style={{ marginBottom: '60px' }} />
            
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  BroadcastNewMessage: PropTypes.func.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  chat: state.chat
});

export default connect(mapStateToProps, { BroadcastNewMessage,setNewMessage,getCurrentProfile,getBalance, deleteAccount })(
  Dashboard
);

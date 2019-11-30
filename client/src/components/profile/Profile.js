import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileCreds from './ProfileCreds';
import ProfileGithub from './ProfileGithub';
import Spinner from '../common/Spinner';
import { getProfileByHandle } from '../../actions/profileAction';
import {setNewMessage} from '../../actions/chatAction2';
import isEmpty from '../../validation/is-empty';
import {BroadcastNewMessage} from '../../actions/chatAction2';
import Push from 'push.js';
import img from '../../img/msg.png';

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
    this.props.BroadcastNewMessage();

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile === null && this.props.profile.loading) {
      this.props.history.push('/not-found');
    }
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
    const { profile, loading } = this.props.profile;
    const { user } = this.props.auth;
    let profileContent;
    

    if (profile === null || loading || isEmpty(profile)) {
      profileContent = <Spinner />;
    } 
    
    
    else {
      profileContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              
            </div>
            <div className="col-md-6" />
          </div>
          <ProfileHeader profile={profile} currentUser={user.id} />
          <ProfileAbout profile={profile} />
          <ProfileCreds
            education={profile.education}
            experience={profile.experience}
          />
          {profile.githubusername ? (
            <ProfileGithub username={profile.githubusername} />
          ) : null}
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{profileContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  getProfileByHandle: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  BroadcastNewMessage: PropTypes.func.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  chat: state.chat
});

export default connect(mapStateToProps, { BroadcastNewMessage,setNewMessage,getProfileByHandle })(Profile);

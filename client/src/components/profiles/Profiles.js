import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles,searchProfiles } from '../../actions/profileAction';
import TextFieldGroup from '../common/TextFieldGroup.js';
import SelectListGroup from '../common/SelectListGroup';
import Pagination from 'react-js-pagination'; 
import {setNewMessage} from '../../actions/chatAction2';
import isEmpty from '../../validation/is-empty';
import {BroadcastNewMessage} from '../../actions/chatAction2';
import Push from 'push.js';
import img from '../../img/msg.png';




class Profiles extends Component {
  constructor(){
    super();
    this.state = {
      search: '',
      type:'all',
      activePage: 1
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  componentDidMount() {
    this.props.getProfiles();
    this.props.BroadcastNewMessage();
  }
  onSubmit(e) {
    e.preventDefault();
    
  }
  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
    let page={};
    page['pageNumber']=pageNumber;
    this.props.getProfiles(page);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    let key={};
    if ([e.target.name]=='search'){
      key['key'] = e.target.value;
      key['type'] = this.state.type;
    }
    else{
      key['key'] = this.state.search;
      key['type'] =  e.target.value;
    }
    console.log(key);
    this.props.searchProfiles(key);
  }

  render() {
    const {newMessage} = this.props.chat;
    if(isEmpty(newMessage)){}
    else {
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
    const { profiles, loading } = this.props.profile;
    let profileItems;
    const options = [
      { label: 'All users', value: 'all' },
      { label: 'Developers', value: 'developer' },
      { label: 'Investors', value: 'investor' },
      { label: 'Idea Pitchers', value: 'ideaPitcher' }
    ];

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => (
          <ProfileItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">User Profiles!</h1>
              <p className="lead text-center">
                Browse and connect with developers
              </p>
              <center>
              <form onSubmit={this.onSubmit} style={{width:'50%'}}>
              <input
                
                className='form-control form-control-lg'
                placeholder="Search by name"
                name="search"
                type="text"
                value={this.state.search}
                onChange={this.onChange}
                
              />
                <SelectListGroup
                placeholder="type"
                name="type"
                value={this.state.type}
                onChange={this.onChange}
                options={options}
                
              />

                
              </form>
              </center>
              <br/>
              {profileItems}
              <Pagination
                 
                 activePage={this.state.activePage}
                 itemsCountPerPage={10}
                 totalItemsCount={this.props.profile.count}
                 pageRangeDisplayed={5}
                 onChange={this.handlePageChange}
                 
               />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  searchProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  BroadcastNewMessage: PropTypes.func.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  chat: state.chat
});

export default connect(mapStateToProps, { BroadcastNewMessage,setNewMessage,getProfiles,searchProfiles })(Profiles);

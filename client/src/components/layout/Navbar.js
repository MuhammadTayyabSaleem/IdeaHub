import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser,getBalance } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileAction';


class Navbar extends Component {

  componentDidMount() {
    this.props.getBalance({id: this.props.auth.user.id});
  }
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const balance = this.props.balance.balance;
    const authLinks = (
      <ul className="navbar-nav ml-auto">

      <li className="nav-item">
          <Link className="nav-link" to="/profiles">
            Profiles
          </Link>
        </li>

      <li className="nav-item">
          <Link className="nav-link" to="/feed">
            Post Feed
          </Link>
        </li>
      

      <li className="nav-item">
      <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
          
        </li>

        <li className="nav-item">
      <Link className="nav-link" to="/requests">
            Requests
          </Link>
        </li>
        
        <li className="nav-item">
          <Link className="nav-link" to="/inbox">
            Inbox
          </Link>
      </li>
        
        <li className="nav-item">
          <a
            href="/"
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            <img
              className="rounded-circle"
              src={user.avatar}
              alt={user.name}
              style={{ width: '25px', marginRight: '5px' }}
              title="You must have a Gravatar connected to your email to display an image"
            />({user.type}) Logout
          </a>
        </li>
        <li className="nav-item" style={{marginLeft:'10px'}}>
          <p style={{color:'gray',marginBottom:'-15px'}}> Balance:</p>
          <p style={{color:'gray',marginTop:'8px'}}> ${balance}</p >
      </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4 " >
        <div className="container">
          <Link className="navbar-brand" style={{fontFamily:'normal', fontSize:'35px'}} to="/">
            IdeaHub 
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          
            
            {isAuthenticated ? authLinks : guestLinks}
          
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  getBalance:PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  balance: state.balance
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile ,getBalance })(
  Navbar
);

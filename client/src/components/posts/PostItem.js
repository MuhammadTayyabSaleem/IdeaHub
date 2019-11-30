import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { deletePost, addLike, removeLike, makeRequest,makeServiceRequest } from '../../actions/postActions';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getBalance } from '../../actions/authActions';


class PostItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayDescription: false,
      displayService: false,
      displayInvest:false,
      displayProvideService:false,
      numberOfShares:'',
      message:'',
      TotalPrice:'',
      
      errors:''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitServiceRequest = this.onSubmitServiceRequest.bind(this);
    
  }


  onSubmit(e) {
    e.preventDefault();
    if(this.state.numberOfShares ==='' || this.state.numberOfShares ==='0'){
      window.alert('You can not buy such shares!');
    }
    else{
    this.props.getBalance({id: this.props.auth.user.id});
    if(this.props.post.sharesToSale-this.props.post.sharesSold === 0)
    {
      window.alert('Sorry all the shares are sold for this idea.');
    }
    else if(this.state.numberOfShares > (this.props.post.sharesToSale - this.props.post.sharesSold)){
      window.alert(`You can not buy more than remaining shares`);
  }
  else{
    let amount=(this.state.numberOfShares * this.props.post.sharePrice);
    if(amount > parseInt(this.props.balance.balance,10))
    {window.alert('You do not have enough balance to buy such shares')}
    else{
    if(window.confirm(`Are you sure you want to buy ${this.state.numberOfShares} shares for ${this.state.numberOfShares * this.props.post.sharePrice} Rs/-`))
    {
      const requestData = {
        buyerId: this.props.auth.user.id,
        sellerId: this.props.post.user,
        postId: this.props.post._id,
        shares: this.state.numberOfShares,
        amount: amount.toString()
      };
      this.setState({numberOfShares:'', TotalPrice: '' })
      
      this.props.makeRequest(requestData);
    }}}
  }
  }

  onSubmitServiceRequest(e) {
    e.preventDefault();
    if(this.state.message ===''){
      window.alert('Just write some message request to guide idea pitcher!');
    }
    else{
    if(window.confirm("Are you sure to send the request?")){
      const requestData = {
        buyerId: this.props.auth.user.id,
        sellerId: this.props.post.user,
        postId: this.props.post._id,
        message: this.state.message,
        servicePrice: this.props.post.servicePrice
      };
      this.setState({message:""})
      this.props.makeServiceRequest(requestData);
  
    }}
  }

  onChange(e) {
    if(e.target.name==='message'){
      this.setState({ [e.target.name]: e.target.value });
    }
    else{
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
    if(e.target.name==='numberOfShares'){
    this.setState({ [e.target.name]: e.target.value });
    this.setState({ TotalPrice: e.target.value * this.props.post.sharePrice });
    }
    else{
      this.setState({ [e.target.name]: e.target.value });
      this.setState({ numberOfShares: e.target.value / this.props.post.sharePrice });
      }
    }}}


  onDeleteClick(id) {
    this.props.deletePost(id);
  }

  onLikeClick(id) {
    this.props.addLike(id);
  }

  onUnlikeClick(id) {
    this.props.removeLike(id);
  }

  findUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  render() {

    const { post, auth, showActions } = this.props;
    const { displayDescription,displayService,displayProvideService, displayInvest,TotalPrice ,errors} = this.state;

    let descriptionView;
    let serviceView;
    let provideServiceView;
    let sharePriceView;
    let investView;
    let serviceOrShareButton;
    
    if(post.sharesSold===0){
      post.sharesSold=1;
    }
    if(post.sharePrice !=='' & post.servicePrice !==''){
      sharePriceView=(
      <>
        <p style={{display:'inline'}}>Price Per Share: </p>
        <p className='font-weight-bold' style={{display:'inline'}}>{post.sharePrice} Rs/-</p>
        <br/>
        <p style={{display:'inline'}}>Service Price: </p>
        <p className='font-weight-bold' style={{display:'inline'}}>{post.servicePrice} Rs/-</p>
        
      </>
      );
    }
    else if(post.sharePrice ==='' & post.servicePrice !==''){
      sharePriceView=(
        <>
        <p className='font-weight-bold'>Not for SALE!</p>
        
        <p style={{display:'inline'}}>Service Price: </p>
        <p className='font-weight-bold' style={{display:'inline'}}>{post.servicePrice} Rs/-</p>
        </>
      );
    }
    else if(post.sharePrice !=='' & post.servicePrice ===''){
      sharePriceView=(
        <>
        <p style={{display:'inline'}}>Price Per Share: </p>
        <p className='font-weight-bold' style={{display:'inline'}}>{post.sharePrice} Rs/-</p>
        
        <p className='font-weight-bold'>No Service Needed!</p>
        </>
      );
    }
    if (displayDescription) {
      descriptionView = (
        <div >
          
          <p>{post.description}</p>
          
        </div>
      );}
      if (displayService) {
        serviceView = (
          <div >
            
            <p>{post.service}</p>
            
          </div>
        );}

        
        
        if (displayInvest) {
          
        investView = (
          <div style={{marginLeft:'130px'}}>
            
            <input
                
                 className={classnames('form-control form-control-lg numberinput' , {
                 'is-invalid': ""
                   })}
                placeholder={"Enter Number of shares"}
                name={"numberOfShares"}
                value={this.state.numberOfShares}
                onChange={this.onChange}
                error={errors.shares}
                />
                
            <input
              
                 className={classnames('form-control form-control-lg mt-2', {
                 'is-invalid': ""
                   })}
                placeholder="Enter Investment Ammount"
                name="TotalPrice"
                value={this.state.TotalPrice}
                onChange={this.onChange}
                 />
                <p name="numberOfShares"
                  value={this.state.numberOfShares}
                  >Total Cost: {TotalPrice}Rs/-</p>
                <button type="submit" onClick={this.onSubmit} className="btn btn-danger">
                Buy
              </button>
            
          </div>
        );}
        
        if (displayProvideService) {
          
          provideServiceView = (
            <div style={{marginLeft:'130px'}}>
              
              <input
                  
                   className={classnames('form-control form-control-lg ' , {
                   'is-invalid': ""
                     })}
                  placeholder={"Type a request Message"}
                  name={"message"}
                  value={this.state.message}
                  onChange={this.onChange}
                  />
                  
                  <button type="submit" onClick={this.onSubmitServiceRequest} className="btn btn-danger">
                  Send Request
                </button>
              
            </div>
          );}

    if(auth.user.type === 'investor' )
    {
      serviceOrShareButton = (
        <>
          <button
                    type="button"
                    style={{backgroundColor: '#FFBD44', color: 'white'}}
                    onClick={() => {
                      this.props.getBalance({id: this.props.auth.user.id});
                      this.setState(prevState => ({
                        displayInvest
                : !prevState.displayInvest
                
                      }));
                    }}
                    className="btn btn-light m-4"
                  >
                    Buy Shares
                  </button>
        </>
      )
    }
    if(auth.user.type === 'developer' )
    {
      if(post.service !=='' & post.sharePrice!==''){
      serviceOrShareButton = (
        <>
          <button
                    type="button"
                    style={{backgroundColor: 'orange', color: 'white'}}
                    onClick={() => {
                      this.props.getBalance({id: this.props.auth.user.id});
                      this.setState(prevState => ({
                        displayInvest
                : !prevState.displayInvest
                
                      }));
                    }}
                    className="btn btn-light "
                  >
                    Buy Shares
                  </button>
                  <button
                    type="button"
                    style={{backgroundColor: 'green', color: 'white'}}
                    onClick={() => {
                      this.props.getBalance({id: this.props.auth.user.id});
                      this.setState(prevState => ({
                        displayProvideService
                : !prevState.displayProvideService
                
                      }));
                    }}
                    className="btn btn-light "
                  >
                    Provide Service
                  </button>
        </>
      )}
      else if(post.service !=='' ){
        serviceOrShareButton = (
          <>
                    <button
                      type="button"
                      style={{backgroundColor: 'green', color: 'white'}}
                      onClick={() => {
                        this.setState(prevState => ({
                          displayProvideService
                  : !prevState.displayProvideService
                  
                        }));
                      }}
                      className="btn btn-light "
                    >
                      Provide Service
                    </button>
          </>
        )}
        else if(post.sharePrice !==''){
          serviceOrShareButton = (
            <>
              <button
                        type="button"
                        style={{backgroundColor: 'orange', color: 'white'}}
                        onClick={() => {
                          this.props.getBalance({id: this.props.auth.user.id});
                          this.setState(prevState => ({
                            displayInvest
                    : !prevState.displayInvest
                    
                          }));
                        }}
                        className="btn btn-light "
                      >
                        Buy Shares
                      </button>
                     
            </>
          )}
    }
    
    


    return (
      <div className="card card-body mb-3 " style={{background:'#F8F8FF'}}>
        <div className="row" >
          <div className="col-md-2">
          <Link to={`/profile/${post.username}`}>
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />
            </Link>
            
            <h5 className="text-center">{post.username}</h5>
          </div>
          <div className="col-md-4">
            <h2 >{post.title}</h2>
            {showActions ? (
              <span>
                <button
                  onClick={this.onLikeClick.bind(this, post._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i
                    className={classnames('fas fa-thumbs-up', {
                      'text-info': this.findUserLike(post.likes)
                    })}
                  />
                  <span className="badge badge-light">{post.likes.length}</span>
                </button>
                <button
                  onClick={this.onUnlikeClick.bind(this, post._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i className="text-secondary fas fa-thumbs-down" />
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {post.user === auth.user.id ? (
                  <button
                    onClick={this.onDeleteClick.bind(this, post._id)}
                    type="button"
                    className="btn btn-danger mr-1"
                  >
                    <i className="fas fa-times" />
                  </button>
                ) : null}
                
                <div className='col-sm-10'>
                <br/>
                <ProgressBar variant="success"  label={` ${post.sharesSold}% Shares Sold`} animated now={post.sharesSold} />
                <p>Total Shares for Sale {post.sharesToSale}, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Shares Remaining: {post.sharesToSale-post.sharesSold}%</p>
                {sharePriceView}
                
                </div>
              </span>
            ) : null}
          </div>
          
          <div className="col-md-6">
                  <button
                    type="button"
                    style={{backgroundColor: 'SlateBlue', color: 'white'}}
                    onClick={() => {
                      this.setState(prevState => ({
                        displayDescription
                : !prevState.displayDescription
                
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Description
                  </button>
                  
                  <button
                    type="button"
                    style={{backgroundColor: 'SlateBlue', color: 'white'}}
                    onClick={() => {
                      this.setState(prevState => ({
                        displayService
                : !prevState.displayService
                
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Service Details
                  </button>
                  {serviceOrShareButton}
                  {descriptionView}
                  {serviceView}
                  {investView}
                  {provideServiceView}
                </div>
                
                

        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  makeRequest: PropTypes.func.isRequired,
  makeServiceRequest:PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  balance: state.balance,
  errors: state.errors
});

export default connect(mapStateToProps, { deletePost, addLike,getBalance,makeServiceRequest , removeLike,makeRequest })(
  PostItem
);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { deletePost, addLike, removeLike, makeRequest } from '../../actions/postActions';
import ProgressBar from 'react-bootstrap/ProgressBar';


class PostItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayDescription: false,
      displayInvest:false,
      numberOfShares:'',
      TotalPrice:''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
  }


  onSubmit(e) {
    e.preventDefault();
    if(100-this.props.post.sharesSold === 0)
    {
      window.alert('Sorry all the shares are sold for this idea.');
    }
    else if(this.state.numberOfShares > (100-this.props.post.sharesSold)){
      window.alert(`You can not buy more than ${100-this.props.post.sharesSold} shares`);
  }
  else{
    let amount=(this.state.numberOfShares * this.props.post.sharePrice);
    if(amount > parseInt(this.props.auth.user.balance,10))
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
      console.log(requestData);
  
      this.props.makeRequest(requestData);
    }}}
     
  }

  onChange(e) {
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
  }}


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


  render() {

    const { post, auth, showActions } = this.props;
    const { displayDescription, displayInvest,TotalPrice} = this.state;

    let descriptionView;
    let sharePriceView;
    let investView;
    let serviceOrShareButton;
    //let socialInputs2;
    if(post.sharesSold===0){
      post.sharesSold=1;
    }
    if(post.sharePrice){
      sharePriceView=(
      <>
        <p style={{display:'inline'}}>Price Per Share: </p>
        <p className='font-weight-bold' style={{display:'inline'}}>{post.sharePrice} Rs/-</p>
        
      </>
      );
    }
    else{
      sharePriceView=(
        <p className='font-weight-bold'>Not for SALE</p>
      );
    }
    if (displayDescription) {
      descriptionView = (
        <div >
          
          <p>{post.description}</p>
          
        </div>
      );}
      if (displayInvest) {
        investView = (
          <div style={{marginLeft:'130px'}}>
            
            <input
                type={Text}
                 className={classnames('form-control form-control-lg numberinput' , {
                 'is-invalid': ""
                   })}
                placeholder={"Enter Number of shares"}
                name={"numberOfShares"}
                value={this.state.numberOfShares}
                onChange={this.onChange}
                isRequired
                />
                
            <input
                type={Number}
                 className={classnames('form-control form-control-lg mt-2', {
                 'is-invalid': ""
                   })}
                placeholder="Enter Investment Ammount"
                name="TotalPrice"
                value={this.state.TotalPrice}
                onChange={this.onChange}
                isRequired
                 />
                <p name="numberOfShares"
                  value={this.state.numberOfShares}
                  >Total Cost: {TotalPrice}Rs/-</p>
                <button type="submit" onClick={this.onSubmit} className="btn btn-danger">
                Buy
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
                <p>Shares Remaining: {100-post.sharesSold}%</p>
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
                  {serviceOrShareButton}
                  {descriptionView}
                  {investView}
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
  addLike: PropTypes.func.isRequired,
  makeRequest: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deletePost, addLike, removeLike,makeRequest })(
  PostItem
);

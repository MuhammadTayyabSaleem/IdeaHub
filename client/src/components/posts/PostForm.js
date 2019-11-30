import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import TextFieldGroup from '../common/TextFieldGroup';
import { addPost } from '../../actions/postActions';

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      sharePrice: '',
      description: '',
      service:'',
      servicePrice: '',
      sharesToSale: '',
      displaySharePriceInput: false,
      displaySocialInputs2: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

     const { user } = this.props.auth;
     const newPost = {
      title: this.state.title,
      sharePrice: this.state.sharePrice,
      description: this.state.description,
      service: this.state.service,
      servicePrice: this.state.servicePrice,
      sharesToSale: this.state.sharesToSale,
      username: user.name,
      avatar: user.avatar,
      user:user.id
    };
    this.setState({ title: '' ,description: '' ,sharePrice: '',displaySharePriceInput: false,displaySocialInputs2: false, service:'', servicePrice:'' });
    this.props.addPost(newPost);
  }

  onChange(e) {
    
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangePrice(e) {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
    this.setState({ [e.target.name]: e.target.value });
  }}

  render() {
    const { errors,displaySharePriceInput,displaySocialInputs2 } = this.state;
    let socialInputs;
    let socialInputs2;
    if (displaySharePriceInput) {
      socialInputs = (
        <div className='col-md-6' >
          <TextFieldGroup
                  placeholder="Enter Price Per Share in RS/-"
                  name="sharePrice"
                  value={this.state.sharePrice}
                  onChange={this.onChangePrice}
                  error={errors.sharePrice}
                />
                <TextFieldGroup
                  placeholder="Number of shares you want to sale"
                  name="sharesToSale"
                  value={this.state.sharesToSale}
                  onChange={this.onChangePrice}
                  error={errors.sharesToSale}
                />
          
        </div>
      );
    }
    if (displaySocialInputs2) {
      socialInputs2 = (
        <div className='col-md-6'>
          <TextFieldGroup
                  placeholder="Enter Service Here"
                  name="service"
                  value={this.state.service}
                  onChange={this.onChange}
                  error={errors.service}
                />
          <TextFieldGroup
                  placeholder="Enter Price Here"
                  name="servicePrice"
                  value={this.state.servicePrice}
                  onChange={this.onChangePrice}
                  error={errors.servicePrice}
                />
          
        </div>
      );
    }

    return (
      <div className="post-form mb-3" style={{background:'#F8F8FF'}}>
        <div className="card card-info" style={{background:'#F8F8FF'}}>
          <div className="card-header bg-success text-white">Share an Idea...</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
              <TextFieldGroup
                  placeholder="Enter Title Here"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />
                <TextAreaFieldGroup
                  placeholder="Write Description About Idea"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                />
              </div>
              <div className="mb-3">
                  <button
                    type="button"
                    style={{backgroundColor: '#FF7F50', color: 'white'}}
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySharePriceInput
                : !prevState.displaySharePriceInput
                
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Share Price Details
                  </button>
                  <span className="text-muted"> Optional</span>
                </div>
                {socialInputs}

                <div className="mb-3">
                  <button
                    type="button"
                    style={{backgroundColor: '#818890', color: 'white'}}
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs2: !prevState.displaySocialInputs2
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Service Details
                  </button>
                  <span className="text-muted"> Optional</span>
                </div>
                {socialInputs2}
              <button type="submit" onClick={this.onSubmit} className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { addPost })(PostForm);

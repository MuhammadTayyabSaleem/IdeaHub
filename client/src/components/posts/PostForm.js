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
      displaySharePriceInput: false,
      //displaySocialInputs2: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('on submit called');

     const { user } = this.props.auth;

     const newPost = {
      title: this.state.title,
      sharePrice: this.state.sharePrice,
      description: this.state.description,
      username: user.name,
      avatar: user.avatar,
      user:user.id
    };
    console.log(newPost);
    this.setState({ title: '' ,description: '' ,sharePrice: '',displaySharePriceInput: false });
    this.props.addPost(newPost);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors,displaySharePriceInput } = this.state;
    let socialInputs;
    //let socialInputs2;
    if (displaySharePriceInput) {
      socialInputs = (
        <div className='col-md-6' >
          <TextFieldGroup
                  placeholder="Enter Price Per Share in RS/-"
                  name="sharePrice"
                  value={this.state.sharePrice}
                  onChange={this.onChange}
                  error={errors.sharePrice}
                />
          
        </div>
      );
    }
    // if (displaySocialInputs2) {
    //   socialInputs2 = (
    //     <div className='col-md-6'>
    //       <TextFieldGroup
    //               placeholder="Enter Title Here"
    //               name="text"
    //               value={this.state.text}
    //               onChange={this.onChange}
    //               error={errors.text}
    //             />
    //       <TextFieldGroup
    //               placeholder="Enter Title Here"
    //               name="text"
    //               value={this.state.text}
    //               onChange={this.onChange}
    //               error={errors.text}
    //             />
    //     </div>
    //   );
    // }

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

                {/* <div className="mb-3">
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
                {socialInputs2} */}
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

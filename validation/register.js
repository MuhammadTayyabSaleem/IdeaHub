const validator= require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data)
{
  let errors = {};

  if(!validator.isLength(data.name, {min: 2, max:30})){
    errors.name = 'Name must be 2 to 30';
  }

  data.name = !isEmpty(data.name)? data.name : '';
  data.email = !isEmpty(data.email)? data.email: '';
  data.type = !isEmpty(data.type)? data.type : '';
  data.password = !isEmpty(data.password)? data.password : '';
  data.password2 = !isEmpty(data.password2)? data.password2 : ''; 

  if(validator.isEmpty(data.name)){
    errors.name = 'Name field is required';
  }
  if(validator.isEmpty(data.email)){
    errors.email = 'Email field is required';
  }
  if(!validator.isEmail(data.email)){
    errors.email = 'Email is Invalid';
  }
  if(validator.isEmpty(data.type)){
    errors.type = 'Must select a type';
  }
  if(validator.isEmpty(data.password)){
    errors.password = 'Password field is required';
  }
  if(!validator.isLength(data.password, {min: 6, max: 30})){
    errors.password = 'Password must b atleast 6 characters and atmost 30';
  }
  if(validator.isEmpty(data.password2)){
    errors.password2 = 'Confirm Password field is required';
  }
  if(!validator.equals(data.password,data.password2)){
    errors.password2 = 'Passwords must match';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  }
}
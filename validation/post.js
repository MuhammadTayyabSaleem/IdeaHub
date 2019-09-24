const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.description = !isEmpty(data.description) ? data.description : '';
  data.title = !isEmpty(data.title) ? data.title : '';

  if (!Validator.isLength(data.description, { min: 0, max: 1500 })) {
    errors.description = 'Description must be less than 1500 characters';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = 'Title field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};


const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRequestInput(data) {
  let errors = {};

  data.shares = !isEmpty(data.shares) ? data.shares : '';
  data.amount = !isEmpty(data.amount) ? data.amount : '';

  if (Validator.isEmpty(data.shares)) {
    errors.shares = 'Shares field is required';
  }
  if (Validator.isEmpty(data.amount)) {
    errors.amount = 'Amount field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};


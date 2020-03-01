const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};
  const mobileRegex = /^03[0-9]{9}$/;

  data.fullName = !isEmpty(data.fullName) ? data.fullName : '';
  data.mobileNo = !isEmpty(data.mobileNo) ? data.mobileNo : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.fullName, { min: 3, max: 20 })) {
    errors.fullName = 'Name must be between 3-20 characters';
  }

  if (Validator.isEmpty(data.fullName)) {
    errors.fullName = 'Full Name is required !';
  }
  
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid !';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required !';
  }

  let re = mobileRegex.test(data.mobileNo);
  if(re!=true){
      errors.mobileNo = 'Mobile no. is invalid !'
  }

  if (Validator.isEmpty(data.mobileNo)) {
    errors.mobileNo = 'Mobile no. is required !';
  }

  if (Validator.isEmpty(data.password)) { 
    errors.password = 'Password is required !';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password is required !';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match !';
  }

  

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

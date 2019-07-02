module.exports = {
  isValidEmail: email => /[a-z0-9._%+-]+@wolox+\.[a-z]{2,3}(\.[a-z]{2})?/.test(email),
  haveAllParams: user => user.firstName && user.lastName && user.email && user.password
};
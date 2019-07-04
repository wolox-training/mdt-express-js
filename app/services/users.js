// const jwt = require('jsonwebtoken');
const { User } = require('../models'),
  bcrypt = require('bcrypt');

exports.generateUserToken = async data => {
  const user = await User.findOne({
    where: {
      password: data.email
    }
  });
  bcrypt.compare(data.password, user.password, (err, res) => {
    // res == true
  });
  return user;
};

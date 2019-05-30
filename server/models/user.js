const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema ({
  userId: {
    type: String,
    default:'ID-0'
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  authToken: {
    type: String,
    required: true
  },
  idToken: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  username: {
    type: String,
    dafualt:'admin'

  },
  password: {
    type: String,
    default:'admin123'
  },
  about: {
    type: String,
    default:'A registered quantiphi employee!'
  },
  userAdminStatus: {
    type: String,                              // Is he a Admin, Department-Admin, User
    default:'user'
  },
  userDepartment: {
    type: String,                              // admin, sub-admin, server, user
    default:'user'
  },
  time : {
    type : Date, 
    default: Date.now 
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User ({
    userId:req.body.id,
    name: req.body.name,
    email: req.body.email,
    authToken:req.body.authToken,
    idToken:req.body.idToken,
    photoUrl:req.body.photoUrl
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      console.log(err);
      res.json({success: false, msg: 'Failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
});



// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }else{
      const token = jwt.sign({data: user}, config.secret, {
        expiresIn: 604800 // 1 week
      });
      res.json({
        success: true,
        token: 'JWT '+token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userAdminStatus:user.userAdminStatus,
          userDepartment:user.userDepartment
        }
      });
    }
  });
});




// // Authenticate
// router.post('/authenticate', (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   User.getUserByUsername(username, (err, user) => {
//     if(err) throw err;
//     if(!user) {
//       return res.json({success: false, msg: 'User not found'});
//     }

//     User.comparePassword(password, user.password, (err, isMatch) => {
//       if(err) throw err;
//       if(isMatch) {
//         const token = jwt.sign({data: user}, config.secret, {
//           expiresIn: 604800 // 1 week
//         });
//         res.json({
//           success: true,
//           token: 'JWT '+token,
//           user: {
//             id: user._id,
//             name: user.name,
//             username: user.username,
//             email: user.email
//           }
//         })
//       } else {
//         return res.json({success: false, msg: 'Wrong password'});
//       }
//     });
//   });
// });

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});



//Get all users

router.get('/getallusers', passport.authenticate('jwt', {session:false}) , (req, res, next) => {
  
  User.find({},function(err, result){
  if(err){
    console.log(err);
    res.json(err);
  }else{
    res.json(result);
  }
});
});



//Get a user by ID

router.get('/getuserbyid/:id', passport.authenticate('jwt', {session:false}) , (req, res, next) => {
  
  User.findOne({_id:req.params.id}).exec(function(err, result){
  if(err){
    console.log(err);
    res.json(err);
  }else{
    res.json(result);
  }
});
});




//Update user
router.post('/edit/:id', passport.authenticate('jwt', {session:false}) , (req, res, next) => {
  
    User.findOneAndUpdate({_id: req.params.id},{"$set":{
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password

    }}
  ).exec(function(err, edited){
    if(err){
      console.log(err);
      res.status(500).send(err);
    }else{
      res.status(200).send(edited);
    }
  });
});



//Delete User
router.delete('/delete/:id', passport.authenticate('jwt', {session:false}) , (req, res, next) => {
  
  User.findByIdAndRemove({_id: req.params.id},function(err, deleted){
  if(err){
    console.log(err);
    res.json(err);
  }else{
    res.json(deleted);
  }
});
});



module.exports = router;

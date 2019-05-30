const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Incident = require('../models/incidents');
const _ = require('lodash');
"use strict";
const nodemailer = require("nodemailer");

// Add an incident
router.post('/add', (req, res, next) => {
  let newIncident = new Incident ({
    submittedBy: req.body.submittedBy,
    submittedTo: req.body.submittedTo,
    submittedFrom: req.body.submittedFrom,
    priority:req.body.priority,
    currentStatus:req.body.currentStatus,
    assignedTo:req.body.assignedTo,
    issue:req.body.issue
  });
  Incident.addIncident(newIncident, (err, incident) => {
    if(err) {
      res.json({success: false, msg: 'Failed to add incident'});
    } else {
      res.json({success: true, msg: 'incident added'});
    }
  });
});

//Get all incidents
router.get('/getallincidents', (req, res, next) => {
  Incident.find({},function(err, result){
  if(err){
    console.log(err);
    res.json(err);
  }else{
    res.json(result);
  }
});
});


//Get all incidents by submittedBy
router.post('/getincidentsbysubmittedby', (req, res, next) => {
    Incident.find({'submittedBy':req.body.submittedBy},function(err, result){
    if(err){
      console.log(err);
      res.json(err);
    }else{
      res.json(result);
    }
  });
  });

//Get all incidents by assignedTo
router.post('/getincidentsbysubmittedto', (req, res, next) => {
    Incident.find({'submittedTo':req.body.submittedTo},function(err, result){
    if(err){
      console.log(err);
      res.json(err);
    }else{
      res.json(result);
    }
  });
  });

//Get all incidents by assignedTo
router.post('/getincidentsbyassignedto', (req, res, next) => {
    Incident.find({'assignedTo':req.body.assignedTo},function(err, result){
    if(err){
      console.log(err);
      res.json(err);
    }else{
      res.json(result);
    }
  });
  });




//Get an incident
router.get('/getincidentbyid/:id', (req, res, next) => {
  Incident.findOne({_id:req.params.id}).exec(function(err, result){
  if(err){
    console.log(err);
    res.json(err);
  }else{
    res.json(result);
  }
});
});

//Create Comment
router.post('/createcomment/:id', (req, res, next) => {
  Incident.findOneAndUpdate({_id: req.params.id},{ $push: {
    comments:req.body
  }}).then(doc => {
    console.log(doc);
    res.status(200).send({success:true, message:doc});
  }).catch(err=> {
    res.status(500).send({success:false, message:err});
  })
});

//Update Incident
router.post('/edit/:id', (req, res, next) => {
    Incident.findOneAndUpdate({_id: req.params.id},{"$set":{
        submittedBy:req.body.submittedBy,
        submittedTo :req.body.submittedTo,
        submittedFrom:req.body.submittedFrom,
        priority:req.body.priority,
        currentStatus:req.body.currentStatus,
        assignedTo:req.body.assignedTo,
        issue:req.body.issue,
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

//Delete Incident
router.delete('/delete/:id', (req, res, next) => {
  Incident.findByIdAndRemove({_id: req.params.id},function(err, deleted){
  if(err){
    console.log(err);
    res.json(err);
  }else{
    res.json(deleted);
  }
});
});

module.exports = router;
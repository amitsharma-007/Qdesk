    
const mongoose = require('mongoose');
const config = require('../config/database');

// User Schema
const IncidentSchema = mongoose.Schema ({
  submittedBy: {                //User, who generates the incident
    type: String,
    default:'Its a default value!'
  },
  submittedTo: {                // HR, Facility, IT, Account
    type: String,
    default:'Its a default value!'
    
  },
  submittedFrom: {              //Quantum, Eureka, Bangalore, US,
    type: String,
    default:'Its a default value!'

  },
  priority: {                   //Set by Admin (High, Medium, Low)
    type: String,
    default:'Its a default value!'

  },
  currentStatus: {                   //Set by the Admin (Open, Closed, Resolved,)
    type: String,
    default:'Its a default value!'
    
  },
  assignedTo: {                   //Set by Department Admin (High, Medium, Low)
    type: String,
    default:'Its a default value!'

  },
  issue: {                   //Set by Admin (High, Medium, Low)
    type: String,
    default:'Its a default value!'
  },
  editedAt : {
    type : Date, 
    default: Date.now 
  },
  comments:[
    {
      email:{
        type:String
      },
      comment:{
        type:String,
        default:'Default Comment!'
      },
      time:{
        type:String,
        default:Date.now
      }
    }
  ],

  time : {
    type : Date, 
    default: Date.now 
  }

});

const Incident = module.exports = mongoose.model('Incident', IncidentSchema);

module.exports.addIncident = function(newIncident, callback) {
    newIncident.save(callback);
}
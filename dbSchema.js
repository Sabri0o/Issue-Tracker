const mongoose = require('mongoose')

let IssueTracker;

//creating tracker schema

const issueTracker = new mongoose.Schema({
    "issue_title":{type:String,required:true},
    "issue_text":{type:String,required:true},
    "created_by":{type:String,required:true},
    "assigned_to":{type:String},
    "open":{type:Boolean,default:true},
    "status_text":{type:String}
},{timestamps:{createdAt:"created_on",updatedAt:"updated_on"}})

// creating a model
IssueTracker = mongoose.model("IssueTracker",issueTracker)

exports.IssueTrackerModel = IssueTracker
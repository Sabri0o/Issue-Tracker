const mongoose = require('mongoose')

let IssueTracker;
let Project

//creating tracker schema

const issueTracker = new mongoose.Schema({
    "issue_title":{type:String,required:true},
    "issue_text":{type:String,required:true},
    "created_by":{type:String,required:true},
    "assigned_to":{type:String},
    "open":{type:Boolean,default:true},
    "status_text":{type:String}
},{timestamps:{createdAt:"created_on",updatedAt:"updated_on"}})

//creating project schema

const project = new mongoose.Schema({
    "project":{type:String},
    "project_tracker" : [issueTracker]
})

// creating a models
IssueTracker = mongoose.model("IssueTracker",issueTracker)
ProjectTracker = mongoose.model("PssueTracker",project)


exports.IssueTrackerModel = IssueTracker
exports.ProjectTrackerModel = ProjectTracker
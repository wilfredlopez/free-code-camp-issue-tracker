const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String,
    default: ""
  },
  open: {
    type: Boolean,
    default: true
  },
  status_text: {
    type: String,
    default: ""
  },
  updated_on: {
    type: Date,
    default: Date.now().toString()
  },
  created_on: {
    type: Date,
    default: Date.now().toString()
  }
});

IssueSchema.pre("save", function() {
  this.created_on = Date.now().toString();
});

IssueSchema.pre("update", function() {
  this.updated_on = Date.now().toString();
});

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = Issue;

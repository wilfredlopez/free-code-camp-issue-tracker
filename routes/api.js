/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
const Issues = require("../models/Issue");
// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
//im using mongoose

function isEmptyString(s) {
  if (s === "" || s === undefined) {
    return true;
  } else {
    return false;
  }
}

module.exports = function(app) {
  app
    .route("/api/issues/:project")
    .get(async function(req, res) {
      const project = req.params.project;
      try {
        const issues = await Issues.find({
          ...req.query
        });

        // console.log([...issues][0]);
        res.json([...issues]);
      } catch (error) {
        console.log(error);
        res.json({ error: "No Issues Available" });
      }
    })

    .post(async function(req, res) {
      const project = req.params.project;

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;
      try {
        const issue = new Issues({
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || "",
          status_text: status_text || ""
        });

        await issue.save();

        res.json(issue);

        // console.log(issue);
      } catch (error) {
        // console.log(error);
        res.json({ error: "Missing required fields" });
      }
    })

    .put(async function(req, res) {
      var project = req.params.project;
      const { _id, ...fieldsToUpdate } = req.body;
      console.log(_id);
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = fieldsToUpdate;

      if (
        isEmptyString(issue_text) &&
        isEmptyString(issue_title) &&
        isEmptyString(created_by) &&
        isEmptyString(assigned_to) &&
        isEmptyString(status_text)
      ) {
        return res.send("no updated field sent");
      }

      try {
        const updatedIssue = await Issues.findByIdAndUpdate(
          { _id: new ObjectId(_id) },
          { ...fieldsToUpdate },
          { new: true }
        );

        if (!updatedIssue) {
          return res.send("could not update");
        }

        res.send("successfully updated");
      } catch (error) {
        res.send("could not update");
      }
    })

    .delete(async function(req, res) {
      var project = req.params.project;
      const { _id } = req.body;
      // console.log(_id, "DELE");
      if (_id === undefined) {
        return res.send("_id error");
      }
      try {
        const issue = await Issues.findById({ _id: new ObjectId(_id) });

        if (!issue) {
          res.json({
            error: "Issue Not Found"
          });
        }
        await issue.remove();

        res.json({
          success: "deleted " + _id
        });
      } catch (error) {
        // console.log(error);
        res.json({ failed: "could not delete " + _id });
      }
    });
};

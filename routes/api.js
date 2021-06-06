module.exports = function (app, ProjectTrackerModel, IssueTrackerModel) {
  app
    .route("/api/issues/:project?")
    .post(function (req, res) {
      let project = req.params.project || req.body.project;
      // console.log('req.body:',req.body);
      // checking required fields
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json({ error: "required field(s) missing" });
      } else {
        //check if the project exists in db
        ProjectTrackerModel.findOne({ project: project })
          .then((record) => {
            // creating new issue object
            let newIssue = new IssueTrackerModel({
              issue_title: req.body.issue_title,
              issue_text: req.body.issue_text,
              created_by: req.body.created_by,
              assigned_to: req.body.assigned_to,
              status_text: req.body.status_text,
            });
            // if project exists we push the new issue to its project_tracker
            if (record) {
              record.project_tracker.push(newIssue);
              record.save((err, data) => {
                if (err) {
                  console.log("error");
                  res.json({ error: err.message });
                }
                res.json(record.project_tracker.slice(-1)[0]);
              });
            } else {
              // else create a new project and push the new issue to its project_tracker
              let newProject = new ProjectTrackerModel({
                project: project,
                project_tracker: [newIssue],
              });

              newProject.save((err, data) => {
                if (err) {
                  console.log("error");
                  res.json({ error: err.message });
                }
                res.json(newProject.project_tracker[0]);
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json({ error: err.message });
          });
      }
    })

    .get(function (req, res) {
      let project = req.params.project || req.query.project;
      let query = req.query;
      delete query.project;
      // console.log(query);
      // console.log("project", project);
      if (!project) {
        res.json("project name is missing");
      } else {
        // find the specific project
        ProjectTrackerModel.findOne({ project: project })
          .then((record) => {
            // filtering the project_tracker property based on the query
            let filtred = record.project_tracker.filter((issue) => {
              for (key in query) {
                if (query[key] !== issue[key].toString()) {
                  return false;
                }
              }
              return true;
            });
            res.json(filtred);
          })
          .catch((err) => {
            console.log("error:", err.message);
            res.json(err.message);
          });
      }
    })

    .put(function (req, res) {
      let project = req.params.project || req.body.project;
      let issue_id = req.body._id;
      console.log(issue_id)

      delete req.body._id;
      delete req.body.project;
      console.log(req.body)
      if (!project) {
        res.json({ error: "project name is missing" });
      } else if (!issue_id) {
        res.json({ error: "missing _id" });
      } else if (JSON.stringify(req.body) === "{}") {
        res.json({ error: "no update field(s) sent", _id: issue_id });
      } else {
        ProjectTrackerModel.findOne({ project: project })
          .then((project) => {
            if (!project) {
              res.json({ error: "project doesn't exist" });
            } else {
              // good resource
              // https://dev.to/danimalphantom/adding-updating-and-removing-subdocuments-with-mongoose-1dj5
              // find corresponding issue ticket and updating it
              let updated = project.project_tracker.id(issue_id);
              for (field in req.body) {
                updated[field] = req.body[field];
              }
              // saving project
              project.save((err, result) => {
                if (err) {
                  res.json({ error: "error while saving changes" });
                } else {
                  // console.log(result);
                  res.json({
                    result: "successfully updated",
                    _id: issue_id,
                  });
                }
              });
            }
          })
          .catch((err) => {
            console.log("error: ", err.message);
            res.json({ error: "could not update", _id: issue_id });
          });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let issue_id = req.body._id;
      if (!issue_id) {
        res.json({ error: "missing _id" });
      } else if (!project) {
        res.json({ error: "project name is missing" });
      } else {
        ProjectTrackerModel.findOne({ project: project })
          .then((project) => {
            if (!project) {
              res.json({ error: "project doesn't exist" });
            } else {
              let removed = project.project_tracker.id(issue_id);
              removed.remove();
              project.save((err, result) => {
                if (err) {
                  res.json("error while saving changes");
                } else {
                  res.json({ result: "successfully deleted", _id: issue_id });
                }
              });
            }
          })
          .catch((err) => {
            res.json({ error: "could not delete", _id: issue_id });
          });
      }
    });
};

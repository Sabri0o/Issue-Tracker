module.exports = function (app, ProjectTrackerModel, IssueTrackerModel) {
  app
    .route("/api/issues/:project")
    .post(function (req, res) {
      let project = req.params.project;
      let issue = req.body;
      console.log(issue);
      // checking required fields
      if (!issue.title || !issue.text || !issue.createdBy) {
        res.json({ error: "required field(s) missing" });
      } else {
        //check if the project exists in db
        ProjectTrackerModel.findOne({ project: project })
          .then((record) => {
            // creating new issue object
            let newIssue = new IssueTrackerModel({
              issue_title: issue.title,
              issue_text: issue.text,
              created_by: issue.createdBy,
              assigned_to: issue.assignedTo,
              status_text: issue.statusText,
            });
            console.log("record:", record);
            // if project exists we push the new issue to its project_tracker
            if (record) {
              record.project_tracker.push(newIssue);
              record.save((err, data) => {
                if (err) {
                  console.log("error");
                  res.json({ error: err.message });
                }
                res.json(newIssue);
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
                res.json(newIssue);
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json("error:", err.message);
          });
      }
    })

    .get(function (req, res) {
        let project = req.params.project
        ProjectTrackerModel.findOne({project:project},'project_tracker')
        .then(record=>{
            console.log(record.project_tracker)
            res.json(record.project_tracker)
        })
        .catch(err=>{
            console.log('error:',err.message)
            res.json('error')
        })
    });
};

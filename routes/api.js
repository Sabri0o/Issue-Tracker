module.exports = function (app, Model) {
  app.route("/api/issues/:project")
  .post(function (req, res) {
    let issue = req.body;
    console.log(issue)
    var newIssue = new Model({
      issue_title: issue.title,
      issue_text: issue.text,
      created_by: issue.createdBy,
      assigned_to: issue.assignedTo,
      status_text: issue.statusText,
    });
    newIssue.save(function (err, record) {
      if (err) {
        console.log('error while saving');
        res.json({ error: 'required field(s) missing' })
      } else {
        console.log("new issue is saved successfully");
        res.json(record);
      }
    });
  })

  .get(function(req,res){

  })
};

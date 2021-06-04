const express = require("express");
const app = express();
const config = require("./config");
const apiRoutes = require("./routes/api.js");


require("dotenv").config();
const mongoose = require("mongoose");


// to reconize the request object as json request
app.use(express.json());
// to reconize the request object as array or a string
app.use(express.urlencoded({ extended: true }));
// serving static files

app.use("/public", express.static(__dirname + "/public"));


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

mongoose.connect(
  config.mongoURI[app.settings.env],
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  function (err, res) {
    if (err) {
      console.log("Error connecting to the database. " + err);
    } else {
      console.log(
        "Connected to Database: " + app.settings.env
      );
    }
  }
);

// importing IssueTrackerModel modal
const IssueTracker = require("./dbSchema.js").IssueTrackerModel;
// importing IssueTrackerModel modal
const ProjectTracker = require("./dbSchema.js").ProjectTrackerModel;

apiRoutes(app, ProjectTracker, IssueTracker);

app.listen(process.env.PORT || 8000, () => {
  console.log("server is listening...");
});

module.exports = app; // for testing

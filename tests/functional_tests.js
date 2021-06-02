const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const mongoose = require("mongoose");
chai.use(chaiHttp);

// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}

describe("Functional tests", function () {
  describe("POST request to /api/issues/{project}", function () {
    before(function (done) {
      const mySecret = process.env.MONGO_URI;
      mongoose.connect(
        mySecret,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        function (error) {
          if (error) {
            console.log("Database error or database connection error " + error);
          }
          console.log("connected to test database!");
          done();
        }
      );
    });
    it("should create an issue with every field: POST request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .post("/api/issues/project_XY/")
        .send({
          title: "ticket_5",
          text: "testing",
          createdBy: "sabri0o",
          assignedTo: "mister X",
          statusText: "kill everyone then kill yourself",
        })
        .end((err, res) => {
            console.log(res)
          done();
        });
    });
  });
});

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const mongoose = require("mongoose");
require("dotenv").config();
const expect = require("chai").expect;

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
  //Before starting the test, create a sandboxed database connection
  //Once a connection is established invoke done()
  const mySecret = process.env.MONGO_URI;

  // before(function (done) {
  //   // https://github.com/mochajs/mocha/issues/2025
  //   // increasing the timeout to longer than the HTTP API is expected to take to respond
  //   this.timeout(10000);

  //   mongoose.connect(
  //     mySecret,
  //     {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useFindAndModify: false,
  //     },
  //     function (error) {
  //       if (error) {
  //         console.log("Database error or database connection error " + error);
  //       }
  //       console.log("Database state is " + !!mongoose.connection.readyState);
  //       done();
  //     }
  //   );
  // });
  describe("Post requests tests", function () {
    it("should create an issue with every field: POST request to /api/issues/{project}", function (done) {
      //increasing the timeout to longer than the HTTP API is expected to take to respond
      this.timeout(10000);
      chai
        .request(server)
        .post("/api/issues/project_XY/")
        .send({
          title: "ticket_X",
          text: "testing",
          createdBy: "sabri0o",
          assignedTo: "mister X",
          statusText: "kill everyone then kill yourself",
        })
        .end((err, res) => {
          console.log("res.body", res.body);

          expect(res.status).to.equal(200);
          expect(res.body[0]).to.have.property("open", true);

          expect(res.body[0]).to.have.property("issue_title", "ticket_X");
          expect(res.body[0]).to.have.property("issue_text", "testing");
          expect(res.body[0]).to.have.property("created_by", "sabri0o");

          expect(res.body[0]).to.have.property("assigned_to", "mister X");
          expect(res.body[0]).to.have.property(
            "status_text",
            "kill everyone then kill yourself"
          );
          expect(res.body[0]).to.have.property("created_on");
          expect(res.body[0]).to.have.property("updated_on");

          done();
        });
    });
  });
  //After all tests are finished close connection
  after(function (done) {
    console.log("disconnecting db");
    mongoose.connection.close(done);
  });
});

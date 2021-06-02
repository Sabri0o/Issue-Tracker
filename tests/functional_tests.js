const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

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

suite("Functional Tests", function () {
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
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
      .then(() => {
        // in case we are not using the express.json middleware (parse the request into json) 
        // and we want to be sure that the content is a valid json we can run the following code
        // (we accepted as text and parse it into json)
            // let resultObj = JSON.parse(res.text);
            // delete resultObj._id;
            // console.log("resultObj: ", resultObj);
        assert.deepEqual(
          res.json,
          {
            open: true,
            issue_title: "ticket_5",
            issue_text: "testing",
            created_by: "sabri0o",
            assigned_to: "mister X",
            status_text: "kill everyone then kill yourself",
          },
          "keys order doesn't matter"
        );
      })
      .catch((err) => {
        throw err.message;
      });
    done();
  });
});

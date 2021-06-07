process.env.NODE_ENV = "test"; // set the environment on 'test' ('development' by default)

const chaiHttp = require("chai-http");
const chai = require("chai");
const mongoose = require("mongoose");
const server = require("../server");
const expect = require("chai").expect;
const ProjectTracker = require("../dbSchema").ProjectTrackerModel;
const { ProjectTrackerModel, IssueTrackerModel } = require("../dbSchema");
chai.use(chaiHttp);

describe("Functional tests", function () {
  let dummy_id;
  before(function (done) {
    // https://github.com/mochajs/mocha/issues/2025
    // increasing the timeout to longer than the HTTP API is expected to take to respond
    this.timeout(10000);
    ProjectTracker.collection.drop();
    let dummyIssue = new IssueTrackerModel({
      issue_title: "issue title",
      issue_text: "issue text",
      created_by: "sabri0o",
      assigned_to: "to everyone",
      status_text: "cryptonite quest",
    });

    let dummyProject = new ProjectTrackerModel({
      project: "project_XY",
      project_tracker: [dummyIssue],
    });

    dummyProject.save((err, data) => {
      if (err) {
        console.log("dummyDataError:", err.message);
      }
      dummy_id = dummyProject.project_tracker[0].id;
      console.log("dummy_id:", dummy_id);
    });
    done();
  });

  describe("Post requests tests", function () {
    it("should create an issue with every field: POST request to /api/issues/{project}", function (done) {
      //increasing the timeout to longer than the HTTP API is expected to take to respond
      this.timeout(10000);
      chai
        .request(server)
        .post("/api/issues/project_XY?")
        .send({
          issue_title: "ticket_X",
          issue_text: "testing_X",
          created_by: "sabri0o",
          assigned_to: "mister X",
          status_text: "kill everyone then kill yourself",
        })
        .end((err, res) => {
          // console.log("res.body type", typeof res.body);
          // console.log("res.body", res.body);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("open", true);
          expect(res.body).to.have.property("issue_title", "ticket_X");
          expect(res.body).to.have.property("issue_text", "testing_X");
          expect(res.body).to.have.property("created_by", "sabri0o");
          expect(res.body).to.have.property("assigned_to", "mister X");
          expect(res.body).to.have.property(
            "status_text",
            "kill everyone then kill yourself"
          );
          expect(res.body).to.have.property("created_on");
          expect(res.body).to.have.property("updated_on");
          done();
        });
    });

    it("should create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .post("/api/issues/project_XY?")
        .send({
          issue_title: "ticket_Y",
          issue_text: "testing_Y",
          created_by: "sabri0o",
        })
        .end((err, res) => {
          // console.log("res.body type", typeof res.body);
          // console.log("res.body", res.body);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("open", true);
          expect(res.body).to.have.property("issue_title", "ticket_Y");
          expect(res.body).to.have.property("issue_text", "testing_Y");
          expect(res.body).to.have.property("created_by", "sabri0o");
          expect(res.body).to.have.property("assigned_to", "");
          expect(res.body).to.have.property("status_text", "");
          expect(res.body).to.have.property("created_on");
          expect(res.body).to.have.property("updated_on");
          done();
        });
    });
  });

  it("should create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    this.timeout(10000);
    chai
      .request(server)
      .post("/api/issues/project_XY?")
      .send({})
      .end((err, res) => {
        // console.log("res.body type", typeof res.body);
        // console.log("res.body", res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ error: "required field(s) missing" });

        done();
      });
  });

  describe("Get requests tests", function () {
    it("should view issues on a project: GET request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/issues/project_XY?")
        .end((err, res) => {
          // console.log("res.body type", typeof res.body);
          // console.log("res.body", res.body);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an.instanceof(Array);
          for (let issue of res.body) {
            expect(issue).to.have.property("open");
            expect(issue).to.have.property("issue_title");
            expect(issue).to.have.property("issue_text");
            expect(issue).to.have.property("created_by");
            expect(issue).to.have.property("assigned_to");
            expect(issue).to.have.property("status_text");
            expect(issue).to.have.property("created_on");
            expect(issue).to.have.property("updated_on");
          }
          done();
        });
    });

    it("should view issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/issues/project_XY?")
        .query({
          issue_text: "testing_X",
        })
        .end((err, res) => {
          // console.log("res.body type", typeof res.body);
          // console.log("res.body", res.body);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an.instanceof(Array);
          for (let issue of res.body) {
            expect(issue).to.have.property("issue_text", "testing_X");
          }
          done();
        });
    });

    it("should view issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/issues/project_XY?")
        .query({
          issue_text: "testing_Y",
          assigned_to: "",
        })
        .end((err, res) => {
          // console.log("res.body type", typeof res.body);
          // console.log("res.body", res.body);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an.instanceof(Array);
          for (let issue of res.body) {
            expect(issue).to.have.property("issue_text", "testing_Y");
            expect(issue).to.have.property("assigned_to", "");
          }
          done();
        });
    });
  });

  describe("Update requests tests", function () {
    it("should update one field on an issue: PUT request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .put("/api/issues/project_XY?")
        .send({
          _id: dummy_id,
          open: false,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({
            result: "successfully updated",
            _id: dummy_id,
          });
          done();
        });
    });

    it("should update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .put("/api/issues/project_XY?")
        .send({
          _id: dummy_id,
          open: false,
          issue_text: "executing",
          assigned_to: "mister X",
          status_text: "done",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({
            result: "successfully updated",
            _id: dummy_id,
          });
          done();
        });
    });

    it("should update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .put("/api/issues/project_XY?")
        .send({
          open: false,
          issue_text: "executing",
          assigned_to: "mister X",
          status_text: "done",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({ error: "missing _id" });
          done();
        });
    });

    it("should update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .put("/api/issues/project_XY?")
        .send({
          _id: dummy_id,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({
            error: "no update field(s) sent",
            _id: dummy_id,
          });
          done();
        });
    });

    it("should update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .put("/api/issues/project_XY?")
        .send({
          _id: "60b8e7e74d551e44144b4c29",
          assigned_to: "mister Z",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({
            error: "could not update",
            _id: "60b8e7e74d551e44144b4c29",
          });
          done();
        });
    });
  });

  describe("Delete requests tests", function () {
    it("should delete an issue: DELETE request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .delete("/api/issues/project_XY?")
        .send({
          _id: dummy_id,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({
            result: "successfully deleted",
            _id: dummy_id,
          });
          done();
        });
    });

    it("should delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .delete("/api/issues/project_XY?")
        .send({
          _id: "60b8e7e74d551e44144b4c29",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({
            error: "could not delete",
            _id: "60b8e7e74d551e44144b4c29",
          });
          done();
        });
    });

    it("should delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .delete("/api/issues/project_XY?")
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({ error: "missing _id" });
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

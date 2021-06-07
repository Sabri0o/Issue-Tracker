$(document).ready(function () {
  console.log("ready!");
  $(".issueOperation").hide();
  $(".searchField").hide();
  $("#init").addClass("active");
  $("#projectIssues").show();

  openTab = function (evt, issueOp) {
    $("#init").removeClass("active");
    // Get all elements with class="issueOperation" and hide them
    $(".issueOperation").hide();
    $(".nav-link").removeClass("active");
    // Show the current tab, and add an "active" class to the button that opened the tab
    $(`#${issueOp}`).show();
    evt.target.className += " active";
  };

  toggle = function (evt) {
    // console.log(evt.target.id);
    let input = $(`#${evt.target.id}`);
    if (input.prop("checked") == true) {
      $(`.${evt.target.id}`).show();
    } else {
      $(`.${evt.target.id}`).hide();
    }
  };

  // view issues form
  $("#issueViewer").on("submit", function (event) {
    event.preventDefault();
    // console.log(event.target);
    let query = {};
    query.project = $("#projectName").val();
    if ($("#idSearchField").prop("checked") == true) {
      query._id = $("#_id").val();
    }
    query.project = $("#projectName").val();
    if ($("#titleSearchField").prop("checked") == true) {
      query.issue_title = $("#issue_title").val();
    }
    if ($("#createdBySearchField").prop("checked") == true) {
      query.created_by = $("#created_by").val();
    }
    if ($("#assignedToSearchField").prop("checked") == true) {
      query.assigned_to = $("#assigned_to").val();
    }
    if ($("#ticket").prop("checked") == true) {
      query.open = "true";
    } else {
      query.open = "false";
    }
    console.log("query:", query);
    $(".lists").remove();
    $("#issueCards").append("<li class='lists'>" + `Searching...` + "</li>");
    $.get("/api/issues/?", query, function (result) {
      console.log("result:", result);
      console.log("result length:", result.length);
      $(".lists").remove();
      if (Array.isArray(result)) {
        if (Array.isArray(result) && result.length === 0) {
          $("#issueCards").append(
            "<li class='lists'>" + `no results` + "</li>"
          );
        } else {
          for (let issue of result) {
            console.log("issue", issue);
            $("#issueCards").append(
              "<li class='lists'>" +
                `<div class="card">
          <h5 class="card-header">IssueID: ${issue._id}  ${
                  issue.open ? "Opened" : "Closed"
                }</h5>
          <div class="card-body">
            <h5 class="card-title">title: ${issue.issue_title}</h5>
            <p class="card-text"><b>status text:</b> ${issue.issue_text}</p>
            <p class="card-text"><b>status text:</b> ${issue.status_text}</p>
            <p class="card-text"><b>created by:</b> ${
              issue.created_by
            } and <b>assigned to:</b> ${issue.assigned_to}</p>
            <p class="card-text"><b>created on:</b> ${
              issue.created_on
            }  <b>last update:</b>${issue.updated_on}</p>
          </div>
        </div>` +
                "</li>"
            );
          }
        }
      } else {
        $("#issueCards").append("<li class='lists'>" + `${result}` + "</li>");
      }
    });
  });

  // submit new issue form
  $("#submitIssue").on("submit", function (event) {
    event.preventDefault();
    let query = $(this).serialize();
    // console.log("query:", query);
    $(".newIssue").remove();
    $("#submittedIssue").append(
      "<li class='newIssue'>" + `Processing...` + "</li>"
    );
    $.post("/api/issues/?", query, function (result) {
      console.log("result:", result);
      $(".newIssue").remove();
      if (!("error" in result)) {
        $("#submittedIssue").append(
          "<li class='newIssue'>" +
            `<div class="card">
      <h5 class="card-header">IssueID: ${result._id}  ${
              result.open ? "Opened" : "Closed"
            }</h5>
      <div class="card-body">
        <h5 class="card-title">title: ${result.issue_title}</h5>
        <p class="card-text"><b>status text:</b> ${result.status_text}</p>
        <p class="card-text"><b>created by:</b> ${
          result.created_by
        } and <b>assigned to:</b> ${result.assigned_to}</p>
        <p class="card-text"><b>created on:</b> ${
          result.created_on
        }  <b>last update:</b>${result.updated_on}</p>
      </div>
    </div>` +
            "</li>"
        );
      } else {
        $("#submittedIssue").append(
          "<li class='newIssue'>" + `${result.error}` + "</li>"
        );
      }
    });
  });

  // update issue form
  $("#updateForm").on("submit", function (event) {
    event.preventDefault();
    // console.log(event.target);
    let query = {};
    query.project = $("#projectNameUpdate").val();
    query._id = $("#issueIDUpdate").val();

    if ($("#issue_titleUpdateField").prop("checked") == true) {
      query.issue_title = $("#issue_titleUpdate").val();
    }
    if ($("#issue_textUpdateField").prop("checked") == true) {
      query.issue_text = $("#issue_textUpdate").val();
    }
    if ($("#created_byUpdateField").prop("checked") == true) {
      query.created_by = $("#created_byUpdate").val();
    }

    if ($("#assigned_toUpdateField").prop("checked") == true) {
      query.assigned_to = $("#assigned_toUpdate").val();
    }

    if ($("#status_textUpdateField").prop("checked") == true) {
      query.status_text = $("#status_textUpdate").val();
    }

    if ($("#closeTicket").prop("checked") === true) {
      query.open = "false";
    }
    console.log("query:", query);

    $(".updating").remove();
    $("#updatedIssue").append(
      "<li class='updating'>" + `Processing...` + "</li>"
    );
    $.ajax({
      url: "/api/issues/?",
      type: "PUT",
      data: query,
      success: function (result) {
        console.log("result:", result);
        $(".updating").remove();
        $("#updatedIssue").append(
          "<li class='updating'>" +
            `${result.error ? result.error : result.result}` +
            "</li>"
        );
      },
    });
  });
});

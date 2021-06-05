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
  $("form").on("submit", function (event) {
    event.preventDefault();
    console.log(event.target);
    let query = {};
    query.project = $('#projectName').val()
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
    $.get("/api/issues/?", query, function (result) {
      console.log(result);
      // testing
      for (issue in result ) {
        $("#issueCards").append(
          "<li class='lists'>" +
            `<div class="card">
        <h5 class="card-header">Featured</h5>
        <div class="card-body">
          <h5 class="card-title">Special title treatment</h5>
          <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>` +
            "</li>"
        );
      }
    });
  });
});

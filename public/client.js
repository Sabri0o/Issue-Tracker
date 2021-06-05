$(document).ready(function () {
  console.log("ready!");
  $(".issueOperation").hide();
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

  // serialize the form
  $("form").on("submit", function (event) {
    event.preventDefault();
    console.log(event.target);
    let encoded = $(this).serialize()
    console.log("encoded:",encoded);

    // $.get("/api/issues/?", $(this).serialize(), function (result) {
    //   console.log(result);
    // });
  });
});



// Require models
// var Article = require("./models/Article.js");
// var Note = require("./models/Note.js");

// Handle Scrape button

// Handle Save Article button
$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId,
        data: { "saved" : true }
    }).then(function(data) {
        console.log(data);
    });
});

// Handle Clear Article button
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId,
        data: { "saved" : false }
    }).then(function(data) {
        console.log(data);
    });
});

// Handle Save Note button

// Handle Delete Note button

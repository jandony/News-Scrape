// Handle Scrape button

// Handle Save Article button
$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    // console.log(thisId);

    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId,
        data: { "saved" : true }
    }).then(function(data) {
        console.log(data);
    });
    $(this).parent().parent().parent().hide();
    // console.log(tryThis);
});

// Handle Clear Article button
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId,
        data: { saved: false }
    }).then(function(data) {
        console.log(data);
    });
    $(this).parent().parent().parent().hide();
});

// Handle Save Note button
$("#save-note").on("click", function() {
    var thisId = $(this).attr("data-id");
    // console.log(thisId);

    var noteText = $("#note-textarea").val();
    console.log(noteText);

    $.ajax({
        method: "POST",
        url: "/notes/save/" + thisId,
        data: { 
            body: noteText
        }
    }).then(function(data) {
        console.log(data);
    });
    $("#note-textarea").val("");
    // console.log(tryThis);
});

// Handle Delete Note button

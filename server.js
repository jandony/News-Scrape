// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var logger = require("morgan");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Require models
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");

// Initialize Express
var app = express();

app.use(logger("dev"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public
app.use(express.static("public"));

// Set Handlebars as the view engine
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

var port = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Database Error:", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
})

// GET request to render Handlebar homepage to get all Articles
app.get("/", function(req, res) {
    Article.find({ saved: "false" }, function(error, data) {
        var hbsObject = {
            article: data
        };
        res.render("home", hbsObject);
        console.log(hbsObject);
    });
});

app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/section/world").then(function(response) {
    var $ = cheerio.load(response.data);

        $("article").each(function(i, element) {
        var title = $(element).find("h2").text();
        var link = $(element).find("a").attr("href");
        var img = $(element).parent().find("img").attr("src");
        var summary = $(element).find("p").text();

        // console.log(link);

            // Save these results in an object that we'll create into the Article models table
            Article.create({
                title: title,
                link: link,
                img: img,
                summary: summary
            }).then(function(article) {
                console.log(article);
            }).catch(function(err) {
                console.log(err);
            });
        });

        var htmlBtn = $("<a href='/'>Home Screen</a>")
        res.send("Scraped Successfully! Please go back to " + htmlBtn);
    });
});

app.get("/clear", function(req, res) {
    Article.remove({}).then(function(removed) { 
        res.json(removed);
    });
    res.redirect("/");
});


// GET request to render Hanblebars saved page and saved Articles
app.get("/saved", function(req, res) {
    Article.find({ saved: "true" }, function(error, data) {
        var hbsObject = {
            article: data
        };
        res.render("saved", hbsObject);
        console.log(hbsObject);
    });
});

// GET all articles from Mongoose
app.get("/articles", function(req, res) {
    Article.find({})
    .then(function(data) {
        res.json(data);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// GET article by object id
app.get("/articles/:id", function(req, res) {
    Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json(err);
    });
})



// ----- ARTICLES

// POST article
app.post("/articles/save/:id", function (req, res) {
    Article.findOneAndUpdate({ _id: req.params.id }, { "saved" : true }, { new: true })
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json(err);
    });
})

// DELETE an article
app.post("/articles/delete/:id", function (req, res) {
    Article.findOneAndUpdate({ _id: req.params.id }, { "saved" : false , "notes" : [] })
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json(err);
    });
})


// ------ NOTES

// POST a note on an article
app.post("/notes/save/:id", function (req, res) {
    var newNote = new Note ({
        body: req.body.text,
        article: req.params.id
    })

    db.Note.create(newNote)
    .then(function(data) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {"notes": data } }, { new: true } );
    })
    .then(function(data2) {
        res.json(data2);
    }).catch(function(err) {
        res.json(err);
    });
})

// DELETE a note
app.delete("/notes/delete/:id/:article_id", function (req, res) {
    Article.findOneAndUpdate({ _id: req.params.article_id}, { $pull: {"notes": req.params.note_id} })
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json(err);
    });
})

// Listen on port 3000
app.listen(port, function() {
  console.log("App running on port 3000!");
});

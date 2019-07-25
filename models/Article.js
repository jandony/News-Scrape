// Require Mongoose
var mongoose = require("mongoose");

// Create Schemea Class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    link: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
})

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export model
module.exports = Article;
// Require Mongoose
var mongoose = require("mongoose");

// Create Schemea Class
var Schema = mongoose.Schema;

// Create note schema
var NoteSchema = new Schema ({
    body: {
        type: String,
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
})

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export model
module.exports = Note;
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    

    tags: {
        type: [String],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  // This assumes you have a User model that you are referencing
        required: true
    },
    starred: { 
        type: Boolean, 
        default: false 
    },
    done: {
        type: Boolean,
        default: false
      },
      
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);

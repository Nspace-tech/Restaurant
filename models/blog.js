const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    blogTitle: {type: String},
    filename: {type: String},
    category: {type: String},
    content: {type: String},
    author: {type: String},
    date: {
        type: Date,
        default: new Date()
    },
    comments: [{
        username: {type: String},
        comment: {type: String},
        date: {
            type: Date,
            default: new Date()
        }
    }]
});

const Blog = mongoose.model('Blog', UserSchema);

module.exports = Blog;
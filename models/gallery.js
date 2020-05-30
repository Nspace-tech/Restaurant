const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    filename: String,
    category: String
});

const Gallery = mongoose.model('Gallery', UserSchema);

module.exports = Gallery;
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    username: {type: String},
    email: {type: String},
    phone: {type: String},
    message: {type: String},
    date: {
        type: Date,
        default: new Date()
    }
});

const Contact = mongoose.model('Contact', UserSchema);

module.exports = Contact;
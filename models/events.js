const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    eventName: String,
    filename: String,
    eventDate: String,
    eventDesc: String
});

const Event = mongoose.model('Event', UserSchema);

module.exports = Event;
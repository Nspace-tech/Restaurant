const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    username: {type: String},
    phone: {type: String},
    email: {type: String},
    datex: {type: String},
    time: {type: String},
    people: {type: String},
    date: {
        type: Date,
        default: new Date()
    }
});

const Reservation = mongoose.model('Reservation', UserSchema);

module.exports = Reservation;
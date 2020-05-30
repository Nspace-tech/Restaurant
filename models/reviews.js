const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
    customerName: {type: String},
    review: {type: String}
});

const Review = mongoose.model('Review', UserSchema);

module.exports = Review;
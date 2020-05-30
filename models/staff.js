const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({ 
    staffName: { type: String},
    filename: { type: String},
    staffTitle: { type: String},
    aboutStaff: { type: String}
});

const Staff = mongoose.model('Staff', UserSchema);

module.exports = Staff;
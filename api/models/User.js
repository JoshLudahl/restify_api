const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

//  Fetched to login
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});



UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);
module.exports = User;

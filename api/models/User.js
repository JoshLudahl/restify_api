const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');


//  User details
const PersonDetailsSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    streetAddress: String,
    city: String,
    state: String
});


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
    },
    details: [PersonDetailsSchema]
});



UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);
module.exports = User;

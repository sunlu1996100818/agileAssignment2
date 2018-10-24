let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({

        userName:String,
        password:String,
        userType:String


    },

    { collection: 'user' });

module.exports = mongoose.model('users', UserSchema);
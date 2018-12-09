'use strict';

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

    userName: String,
    password: String,
    userType: String

}, { collection: 'user' });

module.exports = mongoose.model('users', UserSchema);
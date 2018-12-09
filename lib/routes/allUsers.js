'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../Models/user');

mongoose.connect('mongodb://localhost:27017/Cargo');

router.findAllUser = function (req, res) {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    User.find({ "userName": req.params.userName }, { "userType": 1, "userName": 1 }, function (err, users111) {
        if (err) {
            res.send(err);
        } else if (users111[0].userType !== "admin") {
            res.json("your authority is not enough! cant find all users!");
        } else {
            res.send(JSON.stringify(users111, null, 5));
        };
    });
};

router.findCertainUserById = function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    User.find({ "userName": req.params.userName }, { "userType": 1, "userName": 1 }, function (err, users111) {
        if (err) {
            res.send(err);
        } else if (users111[0].userType !== "admin") {
            res.json("your authority is not enough! cant find all users!");
        } else {
            res.send(JSON.stringify(users111, null, 5));
        };
    });
};

module.exports = router;
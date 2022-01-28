var express = require('express');
var router = express.Router();

const async = require("async");

const User = require("../models/user");
const Message = require("../models/message");


let path = require("path");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/sign-up", function (req, res, next) {
    res.render("sign-up-form", { title: "Sign Up" });
});

router.post("/sign-up", function (req, res, next) {
    res.render("sign-up-form", { title: "Sign Up" });
});

module.exports = router;

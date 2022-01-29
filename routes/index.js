var express = require("express");
var router = express.Router();

const async = require("async");

const User = require("../models/user");
const Message = require("../models/message");

let path = require("path");

const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
    Message.find().exec(function (err, message_list) {
        if (err) return next(err);

        res.render("main", {
            title: "Messages",
            message_list: message_list,
            user: req.user,
        });
    });
});

router.get("/sign-up", userController.user_sign_up_get);

router.post("/sign-up", userController.user_sign_up_post);

module.exports = router;

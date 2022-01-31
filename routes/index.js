var express = require("express");
var router = express.Router();

const async = require("async");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const session = require("express-session");

const User = require("../models/user");
const Message = require("../models/message");

let path = require("path");

const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
    Message.find().exec(function (err, message_list) {
        if (err) return next(err);

        //console.log(req.user);
        //console.log(req.session.passport);

        res.render("main", {
            title: "Messages",
            message_list: message_list,
            user: req.user,
        });
    });
});

router.get("/sign-up", userController.user_sign_up_get);

router.post("/sign-up", userController.user_sign_up_post);

router.get("/log-in", userController.user_log_in_get);

router.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in",
    })
);

router.post("/log-out", (req, res) => {
    req.session.destroy(function (err) {
        res.redirect("/");
    });
    // req.logout();
});

router.get("/become-member", userController.user_become_member_get);

router.post("/become-member", userController.user_become_member_post);

module.exports = router;

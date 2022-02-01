const User = require("../models/user");
var async = require("async");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { body, validationResult } = require("express-validator");

var mongoose = require("mongoose");
const Message = require("../models/message");

exports.user_sign_up_get = function (req, res, next) {
    res.render("sign-up-form", { title: "Sign Up", user: req.user });
};

// Handle Category create on POST.
exports.user_sign_up_post = [
    body("username")
        .trim()
        .isLength({ min: 1 })
        .withMessage("User name must be specified")
        .escape(),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Password must be specified")
        .escape(),

    (req, res, next) => {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }

            //  new User({
            //      username: req.body.username,
            //      password: hashedPassword,
            //      ok: req.body.password,
            //  }).save((err) => {
            //      if (err) {
            //          return next(err);
            //      }
            //      res.redirect("/");
            //  });

            const errors = validationResult(req);

            if (req.body.password != req.body.confpassword) {
                res.render("sign-up-form", {
                    title: "Sign Up",
                    user: {
                        username: req.body.username,
                        password: req.body.password,
                    },
                    confpassword: "true",
                });

                return;
            }

            if (!errors.isEmpty()) {
                res.render("sign-up-form", {
                    title: "Sign Up",
                    user: req.user,
                    errors: errors.array(),
                });

                return;
            } else {
                // Data from form is valid.
                // Create a Category object with escaped and trimmed data.
                var user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                });
                user.save(function (err) {
                    if (err) return next(err);
                    res.redirect("/");
                });
            }
        });
    },
];

exports.user_log_in_get = function (req, res, next) {
    res.render("log-in-form", { title: "Log in", user: req.user });
};

exports.user_become_member_get = function (req, res, next) {
    res.render("become-form", {
        title: "Become Member",
        type: "Member",
        user: req.user,
    });
};

exports.user_become_member_post = function (req, res, next) {
    if (req.body.memberpassword == "memberpassword") {
        var user = new User({
            username: req.user.username,
            password: req.user.password,
            _id: req.user._id,
            isMember: true,
            isAdmin: req.user.isAdmin,
        });

        User.findByIdAndUpdate(req.user._id, user, {}, function (err, theuser) {
            if (err) return next(err);

            res.redirect("/");
        });
    } else {
        res.render("become-form", {
            title: "Become Member",
            type: "Member",
            error: "Wrong password",
            user: req.user
        });
    }
};

exports.user_become_admin_get = function (req, res, next) {
    res.render("become-form", {
        title: "Become Admin",
        type: "Admin",
        user: req.user,
    });
};

exports.user_become_admin_post = function (req, res, next) {
    if (req.body.memberpassword == "adminpassword") {
        var user = new User({
            username: req.user.username,
            password: req.user.password,
            _id: req.user._id,
            isMember: req.user.isMember,
            isAdmin: true,
        });

        User.findByIdAndUpdate(req.user._id, user, {}, function (err, theuser) {
            if (err) return next(err);

            res.redirect("/");
        });
    } else {
        res.render("become-form", {
            title: "Become Admin",
            type: "Admin",
            user: req.user,
            error: "Wrong password",
        });
    }
};

exports.user_post_message_get = function (req, res, next) {
    res.render("message-form", { title: "New message!", user: req.user });
};

exports.user_post_message_post = (req, res, next) => {
   
    var message = new Message({
        title: req.body.title,
        text: req.body.text,
        author: req.body.userid,
        date: Date.now(),
    });
    message.save(function (err) {
        if (err) return next(err);
        res.redirect("/");
    });
};


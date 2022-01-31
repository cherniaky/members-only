const User = require("../models/user");
var async = require("async");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { body, validationResult } = require("express-validator");

var mongoose = require("mongoose");

exports.user_sign_up_get = function (req, res, next) {
    res.render("sign-up-form", { title: "Sign Up" });
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
    res.render("log-in-form", { title: "Log in" });
};

exports.user_become_member_get = function (req, res, next) {
    res.render("become-form", { title: "Become Member", type: "Member" });
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
        res.render("become-form", { title: "Become Member", type: "Member" ,error:"Wrong password" });
    }
};

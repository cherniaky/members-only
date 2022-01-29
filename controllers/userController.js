const User = require("../models/user");
var async = require("async");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { body, validationResult } = require("express-validator");

var mongoose = require("mongoose");

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }

            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    // passwords match! log user in
                    return done(null, user);
                } else {
                    // passwords do not match!
                    return done(null, false, { message: "Incorrect password" });
                }
            });

            // if (user.password !== password) {
            //     return done(null, false, { message: "Incorrect password" });
            // }

            // return done(null, user);
        });
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


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

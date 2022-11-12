const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    const {name, email, password, confirmPassword} = req.body;

    let errors = [];
    if (!name || !email || !password || !confirmPassword) {
        errors.push({msg: 'please enter all fields'});
    }
    if (password !== confirmPassword) {
        errors.push({msg: 'passwords donot match'});
    }
    if (password.length < 6) {
        errors.push({msg: 'password must be of minimum six characters'});
    }
    if (errors.length > 0) {
        res.render('register', {errors, name, email, password, confirmPassword});
    } else {
        User.findOne({ email })
            .then(user => {
                if(user) {
                    errors.push({msg: 'email already exists'});
                    res.render('register', {errors, name, email, password, confirmPassword});
                }
                else {
                    const newUser = new User({ name, email, password });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save()
                                .then(() => {
                                    req.flash('success_msg', 'you are now registered');
                                    res.redirect('/users/login');
                                })
                                .catch((err) => console.log(err));
                        })
                    })
                }
            })
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout({
        keepSessionInfo: false,
    }, () => {
        req.flash('success_msg', 'you are logged out');
        res.redirect('/users/login');
    });
})

module.exports = router;
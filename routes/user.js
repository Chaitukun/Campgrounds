const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const catchAsync = require('../utils/catchAsync.js');
const passport = require('passport');
const { storeReturnTo } = require('../middleware.js');


router.get('/register', (req, res) => {
  console.log(req.originalUrl);
  res.render('users/register.ejs');
})

router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username: username, email: email });
    const hashedUser = await User.register(user, password);
    req.login(hashedUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome to yelp camp');
      res.redirect('/campgrounds');
    })
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register')
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'Logged in successfully!');
  const redirectUrl = res.locals.returnTo || '/campgrounds';
  res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Campground = require('../models/campground.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');



router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index.ejs', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
  console.log(req.user)
  res.render('campgrounds/new.ejs')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user;
  await campground.save();
  req.flash('success', 'Successfully saved')
  res.redirect(303, `/campgrounds/${campground._id}`)
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  await Campground.findByIdAndUpdate(id, { ...req.body.campground })
  req.flash('success', 'Successfully saved')
  res.redirect(303, `/campgrounds/${id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author')
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  console.log(campground.reviews)
  res.render('campgrounds/show.ejs', { campground })
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that');
    return res.redirect('/login')
  }
  await Campground.findByIdAndDelete(id)
  res.redirect(303, "/campgrounds");
}))

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/reviews.js')
const catchAsync = require('../utils/catchAsync.js');
const Campground = require('../models/campground.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Added a review!')
  res.redirect(`/campgrounds/${campground.id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId)
  req.flash('success', 'Deleted a review!')
  res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;
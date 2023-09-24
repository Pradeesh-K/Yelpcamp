const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');// .. since now we are in the routes directory and we have to go back to access other directories
const {isLoggedIn, isReviewAuthor,validateReview} = require('../middleware');
const reviews = require('../controllers/reviews')

router.post('/',isLoggedIn,  validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;

const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const newReview = new Review(req.body);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    req.flash('success','Created a new review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);
    req.flash('success','Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}


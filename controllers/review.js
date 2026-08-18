const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.postReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  };

module.exports.reviewEdit = async (req, res) => {

    let { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    res.render("listings/review/edit", {
      review,
      listingId: id
    });

  };

module.exports.reviewUpdate = async (req, res) => {
    let { id, reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      req.body.review,
      { new: true }
    );
    req.flash("success", "Review updated successfully!");
    res.redirect(`/listings/${id}`);
  };
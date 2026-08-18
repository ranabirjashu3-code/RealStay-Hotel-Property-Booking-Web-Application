const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");   
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const { postReview } = require("../controllers/review.js");

const reviewController = require("../controllers/review");


router
.route("/")
.post(
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.postReview));

  router
  .route("/:reviewId")
  .delete(
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview))
  .put(
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.reviewUpdate)
);

//Review edit
router.get(
  "/:reviewId/edit",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.reviewEdit)
);

module.exports = router;
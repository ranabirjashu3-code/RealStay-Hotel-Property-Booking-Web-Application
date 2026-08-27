const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review");


router
.route("/")
.post(
  isLoggedIn,
  validateReview,
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
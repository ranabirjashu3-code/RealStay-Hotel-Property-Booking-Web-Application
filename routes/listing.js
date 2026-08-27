const express = require("express");
const router  = express.Router();
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


const listingController = require("../controllers/listing.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.array('listing[images]', 10),
    validateListing, 
    wrapAsync(listingController.createListing))
 
  
//new route
router.get(
  "/new",
   isLoggedIn, 
   listingController.renderNewForm);
   
//sugestion
router.get(
    "/suggestions",
    wrapAsync(listingController.suggestions)
);

router
  .route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

//add images
router.post(
    "/:id/images",
    isLoggedIn,
    isOwner,
    upload.array("listing[images]", 10),
    wrapAsync(listingController.addImages)
);

//delete image
router.delete(
    "/:id/images/:imageIndex",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteImage)
);

//edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.rendereditForm)
);

module.exports = router;
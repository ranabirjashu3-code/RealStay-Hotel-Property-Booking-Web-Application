const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { cloudinary } = require("../cloudConfig");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
    .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
    .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));

    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
  };

module.exports.rendereditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {

    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

module.exports.addImages = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    const newImages = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));

    listing.images.push(...newImages);

    await listing.save();

    req.flash("success", "Photos added successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteImage = async (req, res) => {

    const { id, imageIndex } = req.params;

    const listing = await Listing.findById(id);

    const image = listing.images[imageIndex];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.filename);

    // Remove from MongoDB
    listing.images.splice(imageIndex, 1);

    await listing.save();

    req.flash("success","Photo deleted successfully.");

    res.redirect(`/listings/${id}`);
};

//Searching
module.exports.index = async (req, res) => {

    const { search } = req.query;

    let allListings;

    if (search && search.trim() !== "") {

        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$price" },
                            regex: search,
                            options: "i"
                        }
                    }
                }
            ]
        });

    } else {

        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
};


//sugestions
module.exports.suggestions = async (req, res) => {

    const { search } = req.query;

    if (!search || search.trim() === "") {
        return res.json([]);
    }

    const regex = new RegExp(search.trim(), "i");

    const listings = await Listing.find({
        $or: [
            { title: regex },
            { description: regex },
            { location: regex },
            { country: regex }
        ]
    })
    .select("title location country price")
    .limit(8);

    res.json(listings);
};
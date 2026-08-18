const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },

    description: {
        type: String,
        required: [true, "Description is required"]
    },

    images: [
        {
        filename: String,
        url: String  
    }],

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [1, "Price must be greater than 0"]
    },

    location: {
        type: String,
        required: [true, "Location is required"]
    },

    country: {
        type: String,
        required: [true, "Country is required"]
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
 if(listing){
       await Review.deleteMany({_id: {$in: listing.reviews}});
 }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
require("dotenv").config();

const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLAS_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  await initDB();

  await mongoose.connection.close();
  console.log("Database connection closed");
}

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a357e381727c8d8ccfe277c"
  }));

  await Listing.insertMany(initData.data);

  console.log("Data was initialized");
};

main().catch((err) => {
  console.log(err);
});
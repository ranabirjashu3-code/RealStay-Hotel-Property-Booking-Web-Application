require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLAS_URL;

console.log("ATLAS_URL loaded:", !!MONGO_URL);

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await Listing.deleteMany({});

    const data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a357e381727c8d8ccfe277c"
    }));

    await Listing.insertMany(data);

    console.log("Data was initialized");

    await mongoose.connection.close();
}

main().catch(console.error);
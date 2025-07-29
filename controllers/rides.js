const express = require("express");
const router = express.Router();

const Ride = require("../models/ride");

router.get("/", async (req, res) => {
  try {
    const populatedRides = await Ride.find({}).populate("owner")
    console.log(`populated rides:${populatedRides}`)
    res.render("rides/index.ejs", {
      rides: populatedRides
    })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})


module.exports = router;
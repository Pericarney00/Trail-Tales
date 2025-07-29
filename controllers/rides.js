const express = require("express");
const router = express.Router();

const Ride = require("../models/ride");

router.get("/", async (req, res) => {
  try {
    const populatedRides = await Ride.find({}).populate("owner")
    
    res.render("rides/index.ejs", {
      rides: populatedRides
    })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})


router.get("/new", async (req, res) => {
  try {
    res.render("rides/new.ejs")
  } catch (error) {
    console.log("/")
    res.redirect("/")
  }
})

router.post("/", async (req, res) => {
  try {
    req.body.owner = req.session.user._id;
    
    if (req.body.completedFullTrail === "on") {
      req.body.completedFullTrail = true;
    } else {
      req.body.completedFullTrail = false;
    }

    await Ride.create(req.body);
    res.redirect("/rides")
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})


router.get("/:rideId", async (req, res) => {
  try {
    const populatedRide = await Ride.findById(req.params.rideId).populate("owner");
    console.log("Populated Ride is:", req.params.rideId);
    res.render("rides/show.ejs", {
      ride: populatedRide,
    });
  } catch (error) {
    console.log("/")
    res.redirect("/")
  }
})









module.exports = router;
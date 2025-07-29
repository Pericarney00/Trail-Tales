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
    res.redirect("/")
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})
module.exports = router;
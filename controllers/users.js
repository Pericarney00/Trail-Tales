const express = require("express");
const router = express.Router();

const User = require("../models/user")
const Ride = require("../models/ride");



router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const allUsers = await User.find({})
    const allOtherUsers = await User.find({
      username: { $ne: currentUser.username },
    });
    const populatedRidesAll = await Ride.find().populate("owner");

    res.render("users/index.ejs", {
      rides: populatedRidesAll
    })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})



module.exports = router;
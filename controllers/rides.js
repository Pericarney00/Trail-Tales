const express = require("express");
const router = express.Router();

const User = require("../models/user")
const Ride = require("../models/ride");

router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    const allOtherUsers = await User.find({username:{$ne:currentUser.username}})
    const populatedRidesAll = await Ride.find().populate("owner")
    const currentUserpopulatedRidesAll = await Ride.find({owner:req.session.user._id}).populate("owner");

    res.render("rides/index.ejs", {
      rides: currentUserpopulatedRidesAll
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

router.post("/:rideId/favorited-by/:userId", async (req, res) => {
  try {
    await Ride.findByIdAndUpdate(req.params.rideId, {
      $push: { favoritedByUsers: req.params.userId }
    });
    res.redirect(`/rides/${req.params.rideId}`);
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})



router.get("/:rideId", async (req, res) => {
  try {
    const populatedRide = await Ride.findById(req.params.rideId).populate("owner");

    const userHasFavorited = populatedRide.favoritedByUsers.some((user) => 
      user.equals(req.session.user._id)
    )

    res.render("rides/show.ejs", {
      ride: populatedRide,
      userHasFavorited
    });
  } catch (error) {
    console.log("/")
    res.redirect("/")
  }
})

router.delete("/:rideId/favorited-by/:userId", async (req, res) => {
  try {
    await Ride.findByIdAndUpdate(req.params.rideId, {
      $pull: { favoritedByUsers: req.params.userId },
    });
    res.redirect(`/rides/${req.params.rideId}`);
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
});

router.get("/:rideId/edit", async (req, res) => {
  try { 
    const currentRide = await Ride.findById(req.params.rideId);
    res.render("rides/edit.ejs", {
      ride: currentRide,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:rideId", async (req, res) => {
  try {
    if (req.body.completedFullTrail === "on") {
      req.body.completedFullTrail = true;
    } else {
      req.body.completedFullTrail = false;
    }
    
    const currentRide = await Ride.findByIdAndUpdate(req.params.rideId, req.body);
    res.redirect("/rides")
  } catch (error) {
    console.log(error);
    res.redirect("/")
  }
})

router.delete("/:rideId", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    
    if (ride.owner.equals(req.session.user._id)) {
      await ride.deleteOne()
      res.redirect("/rides")
    } else {
      res.send("You dont have permission to do that")
    }

  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})



module.exports = router;
/* ================== Dependencies ================== */
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

/* ================== Sign-Up ================== */
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });

  if (userInDatabase) return res.send("Username is already taken");
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and confirm password must match");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);

  req.session.user = {
    username: user.username,
    _id: user._id,
  };

  req.session.save(() => {
    res.redirect("/");
  });
});

/* ================== Sign-In ================== */
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) return res.send("Login failed. Please try again");
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };
  req.session.save(() => {
    res.redirect("/");
  });
});

/* ================== Sign-Out ================== */
router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

/* ================== Export ================== */
module.exports = router;

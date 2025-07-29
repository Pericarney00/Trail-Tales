const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const moment = require("moment")

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const authController = require("./controllers/auth.js");
const ridesController = require("./controllers/rides")
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
const MongoStore = require("connect-mongo");
mongoose.connect(process.env.MONGODB_URI);
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(passUserToView);

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.use("/auth", authController);
app.use("/rides", ridesController)





app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

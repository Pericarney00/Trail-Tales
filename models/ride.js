const mongoose = require("mongoose")

const rideSchema = new mongoose.Schema({
  timeOfDay: {
    type: String,
    enum: ["Morning", "Afternoon", "Evening"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  routeType: {
    type: String,
    enum: ["Loop", "Out and Back", "Point to Point"],
    required: true,
  },
  minutes: {
    type: Number,
    min: 0,
  },
  miles: {
    type: Number,
    min: 0,
  },
  completedFullTrail: {
    type: Boolean,
  },
  notes: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  favoritedByUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
})


const Ride = mongoose.model("Ride", rideSchema);
module.exports = Ride;
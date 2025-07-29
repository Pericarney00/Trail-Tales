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
  distanceMinutes: {
    type: Number,
  },
  distanceMiles: {
    type: Number,
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
})


const Ride = mongoose.model("Ride", rideSchema);
module.exports = Ride;
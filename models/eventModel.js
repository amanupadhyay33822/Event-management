const mongoose = require('mongoose')


const eventModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: new Date()
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      default: 100,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model if the event has an organizer
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to users who have booked the event
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventModel);
module.exports = Event;

const Event = require('../models/eventModel');
const User = require('../models/userModel');

// CREATE: Add a new event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, location, price, availableSeats } = req.body;
  const id = req.user.userId;
  
    // Check for required fields
    if (!name || !description || !location || !price ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure availableSeats and price are positive numbers
    if (price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }
   

    // Optional: Generate a custom image URL for the event
    const eventImage = `https://example.com/event-images?name=${encodeURIComponent(name)}`;

    // Create the event
    const event = await Event.create({
      name,
      description,
      date,
      location,
      organizer:id,
      price,
      eventImage,
      availableSeats
    });

    return res.status(201).json({
      message: "Event created successfully",
      success: true,
      event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// READ: Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    return res.status(200).json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// READ: Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE: Edit an event by ID
exports.updateEvent = async (req, res) => {
  try {
    const { name, description, date, location, price, availableSeats } = req.body;

    // Validation checks for fields if needed
    if (price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }
    if (availableSeats <= 0) {
      return res.status(400).json({ message: "Available seats must be a positive number" });
    }

    // Update the event
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      message: "Event updated successfully",
      success: true,
      event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Remove an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({
      message: "Event deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.bookEvent = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming req.user is populated after authentication
    const { eventId } = req.params;
    const { seats } = req.body;

    // Validate seat input
    if (!seats || seats <= 0) {
      return res.status(400).json({ message: "Please specify a valid number of seats" });
    }

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if there are enough available seats
    if (event.availableSeats < seats) {
      return res.status(400).json({ message: `Only ${event.availableSeats} seats are available` });
    }

    // Find the user by ID and check if they already booked this event
    const user = await User.findById(userId);
    if (user.bookedEvents.includes(eventId)) {
      return res.status(400).json({ message: "You have already booked this event" });
    }

    // Deduct the number of seats from availableSeats and update event
    event.availableSeats -= seats;
    event.attendees.push(userId); // Add user ID to the attendees list
    await event.save();

    // Add event to user's bookedEvents array and save user
    user.bookedEvents.push(eventId);
    await user.save();

    // return res.status(200).json({
    //   message: `Successfully booked ${seats} seat(s) for the event`,
    //   success: true,
    //   eventId: event._id,
    //   eventName: event.name,
    //   seatsBooked: seats,
    //   remainingSeats: event.availableSeats,
    // });
    return res.render("profile"); 
  } catch (error) {
    console.error("Error during event booking:", error);
    res.status(500).json({ message: error.message });
  }
};

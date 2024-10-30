const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');
const { verifyToken } = require('../middleware/auth');

// CREATE: Add a new event
router.post('/create', verifyToken,eventController.createEvent);

// READ: Get all events
router.get('/get', eventController.getAllEvents);

// READ: Get a single event by ID
router.get('/get/:id', eventController.getEventById);

// UPDATE: Edit an event by ID
router.put('/update/:id', eventController.updateEvent);

// DELETE: Remove an event by ID
router.delete('/del/:id', eventController.deleteEvent);

router.post('/book/:eventId', verifyToken, eventController.bookEvent);

module.exports = router;

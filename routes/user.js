const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { register, login, logout, getUserBookedEvents, getUser } = require('../controllers/auth');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/booked-events', verifyToken, getUserBookedEvents);
router.get("/getdetails",verifyToken,getUser);


module.exports = router;

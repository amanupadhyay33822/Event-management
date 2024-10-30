const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "email already exit try different" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // profilePhoto
    const ProfilePhoto = `https://api.dicebear.com/5.x/initials/svg?seed=${fullName}`;

    await User.create({
      fullName:fullName,
      email:email,
      password: hashedPassword,
      profilePhoto: ProfilePhoto,
    });
   

    return res.redirect("/");
  } catch (error) {
    return res.status(501).json({
      message: error.message,
      success: false,
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d",
    });

    // Set the token in a cookie
    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      httpOnly: true,
    });

    // Redirect to the homepage after login
    return res.render("event"); // Change to your homepage route

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getUserBookedEvents = async (req, res) => {
  try {
    const {userId} = req.user; // Assuming user ID is available from auth middleware

    // Fetch the user and populate the product details in itemsBought
    const user = await User.findById(userId).populate('bookedEvents')

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return the itemsBought array
    return res.status(200).json({
      success: true,
      BookedTicket: user.bookedEvents, // This will exclude the buffer field
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const {userId} = req.user; // Assuming user ID is available from auth
      const user = await User.findById(userId);
      
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }


    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
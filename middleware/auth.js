const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

//auth
exports.verifyToken = async (req, res, next) => {
  try {
    //extracting..
   
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    //if token is  missing...
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verifying... the token
    try {


      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decode;
    } catch (error) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

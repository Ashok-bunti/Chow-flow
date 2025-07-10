import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import userModel from "../models/userModel.js";

const authService = {
  // Create JWT token for user authentication
  createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET);
  },

  // Login existing user
  async loginUser(email, password) {
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return { success: false, message: "User does not exist" };
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }
    
    const token = this.createToken(user._id);
    return { success: true, token };
  },

  // Register new user
  async registerUser(name, email, password) {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return { success: false, message: "User already exists" };
    }
    
    // Validate email format
    if (!validator.isEmail(email)) {
      return { success: false, message: "Please enter a valid email" };
    }
    
    // Validate password strength
    if (password.length < 8) {
      return { success: false, message: "Please enter a strong password" };
    }
    
    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create and save new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });
    
    const user = await newUser.save();
    const token = this.createToken(user._id);
    
    return { success: true, token };
  }
};

export default authService;
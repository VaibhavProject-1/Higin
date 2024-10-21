import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import jwt from 'jsonwebtoken';

// Signup User
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user (default role: 'sales')
    const user = await User.create({
      name,
      email,
      password,  // This will be hashed in the User model pre-save hook
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Adding role just in case
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error in creating user', error });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error in user login', error });
  }
};


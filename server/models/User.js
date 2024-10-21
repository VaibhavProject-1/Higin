import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['sales', 'admin'],
    default: 'sales',
  },
  // Remove single target/currentSales fields, replace with a history of monthly targets and sales
  salesProgress: [{
    year: {
      type: Number,  // Store the year explicitly (e.g., 2024)
      required: true,
    },
    month: {
      type: String,  // e.g. "2024-10" (Year-Month format)
      required: true,
    },
    target: {
      type: Number,
      default: 0,  // Monthly target for sales officers
    },
    currentSales: {
      type: Number,
      default: 0,  // Progress toward the target for that specific month
    }
  }],
  location: {
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
    default: null,  // Sales officer's live location
  },
}, { timestamps: true });

// Password hashing middleware (unchanged)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords (unchanged)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
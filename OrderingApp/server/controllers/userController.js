import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Create a new user
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create and save new user
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update an existing user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, target, month, year } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    // If the new password is provided and differs from the current hashed password, hash and update it
    if (password && !(await bcrypt.compare(password, user.password))) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Standardize month to ensure comparison consistency
    const standardizedMonth = month.trim().toLowerCase();

    // Update sales progress (add new or update existing entry for the specific month and year)
    if (target && month && year) {
      const existingEntryIndex = user.salesProgress.findIndex(
        (entry) =>
          entry.month.toLowerCase() === standardizedMonth && entry.year === parseInt(year, 10)
      );

      if (existingEntryIndex > -1) {
        // If entry for the month and year exists, update it
        user.salesProgress[existingEntryIndex].target = target;
      } else {
        // If no entry exists, add a new one
        user.salesProgress.push({ month: standardizedMonth, year: parseInt(year, 10), target, currentSales: 0 });
      }
    }

    // Save updated user
    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



// Fetch all users (optional)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch single user by ID (optional)
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a user (optional)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update sales officer's progress when an order is completed
export const updateSalesProgress = async (userId, year, month, target, currentSales) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if there is already an entry for this year and month
    const existingEntryIndex = user.salesProgress.findIndex(
      (entry) => entry.year === year && entry.month === month
    );

    if (existingEntryIndex > -1) {
      // If the year and month exist, update the target and currentSales
      user.salesProgress[existingEntryIndex].target = target;
      user.salesProgress[existingEntryIndex].currentSales = currentSales;
    } else {
      // Otherwise, add a new entry for the current month and year
      user.salesProgress.push({ year, month, target, currentSales });
    }

    await user.save();
    return user;
  } catch (error) {
    console.error('Error updating sales progress:', error);
    throw error;
  }
};



// Update sales officer location
export const updateSalesOfficerLocation = async (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's location
    user.location = { lat, lng };
    await user.save();

    res.status(200).json({ message: 'Location updated successfully', location: user.location });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get live location of all sales officers
export const getSalesOfficerLocations = async (req, res) => {
  try {
    const salesOfficers = await User.find({ role: 'sales' }).select('name email location');
    res.status(200).json(salesOfficers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update target for a specific month
export const updateSalesTarget = async (req, res) => {
  const { id } = req.params;  // Sales officer ID
  const { month, year, target } = req.body;  // Add year to the target update request

  console.log(`Updating sales target for user ${id} for ${year}-${month} with target ${target}`);  // Log incoming data

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if sales target for the month already exists, if yes, update it
    const existingTarget = user.salesProgress.find(progress => progress.month === `${year}-${month}`);

    if (existingTarget) {
      existingTarget.target = target;
    } else {
      // If the target for the month doesn't exist, create a new entry
      user.salesProgress.push({ month: `${year}-${month}`, target });
    }

    await user.save();
    console.log('Updated user salesProgress:', user.salesProgress);  // Log the updated sales progress
    res.status(200).json({ message: 'Sales target updated successfully', user });
  } catch (error) {
    console.error('Error updating sales target:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



// Get sales progress for a specific officer
export const getSalesProgress = async (req, res) => {
  const { id } = req.params;  // Sales officer ID
  const { month } = req.query;  // Month in YYYY-MM format

  try {
    const user = await User.findById(id).select('salesProgress');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get sales progress for the requested month
    const progress = user.salesProgress.find(prog => prog.month === month);

    if (!progress) {
      return res.status(404).json({ message: 'No sales progress found for the specified month' });
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
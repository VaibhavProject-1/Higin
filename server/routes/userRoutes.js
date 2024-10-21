import express from 'express';
import {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateSalesOfficerLocation,
  getSalesOfficerLocations,
} from '../controllers/userController.js';

const router = express.Router();

// Route to create a new user
router.post('/create', createUser);

// Route to update a user
router.put('/edit/:id', updateUser);

// Route to get all users (optional)
router.get('/list', getAllUsers);

// Route to get a user by ID (optional)
router.get('/:id', getUserById);

// Route to delete a user (optional)
router.delete('/delete/:id', deleteUser);

// Sales officer location tracking
router.put('/location/:id', updateSalesOfficerLocation);
router.get('/locations', getSalesOfficerLocations);

export default router;
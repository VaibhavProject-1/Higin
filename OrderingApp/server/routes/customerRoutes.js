import express from 'express';
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { protect, checkSalesOrAdminRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Customer routes
router.post('/', createCustomer, protect, checkSalesOrAdminRole,);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer, protect, checkSalesOrAdminRole);
router.delete('/:id', deleteCustomer, protect, checkSalesOrAdminRole);

export default router;
import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getOrdersBySalesOfficer } from '../controllers/orderController.js';
import { protect, checkSalesOrAdminRole,checkAdminRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Order routes
router.post('/', createOrder, protect, checkSalesOrAdminRole);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder, protect, checkAdminRole);
router.delete('/:id', deleteOrder, protect, checkAdminRole);

// In your routes file
router.get('/sales-officer/:salesOfficerId', getOrdersBySalesOfficer);

export default router;
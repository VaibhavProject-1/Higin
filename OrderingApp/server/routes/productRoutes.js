import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import multer from 'multer';
import path from 'path';
import { protect, checkAdminRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Set up multer for handling image uploads locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensures a unique name
  },
});

const upload = multer({ storage: storage });

// Product routes
router.post('/', upload.single('image'), createProduct, protect, checkAdminRole); // Apply multer middleware for creating product with image
router.put('/:id', upload.single('image'), updateProduct, protect, checkAdminRole); // Apply multer middleware for updating product with image
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct, protect, checkAdminRole);

export default router;
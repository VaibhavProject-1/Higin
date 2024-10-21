import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for handling image uploads locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure the file has a unique name
  },
});

export const upload = multer({ storage: storage }).single('image');

// Create a new product with image upload
export const createProduct = async (req, res) => {
  console.log("Create product method hit");
  console.log(req.file); // This will now have the file data
  const { name, price, description, category, stock } = req.body;

  // Use the image path (or an empty string if no image was uploaded)
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const product = await Product.create({
      name,
      price,
      description,
      category,
      stock,
      imageUrl, // Store image URL
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update product (with image upload)
// export const updateProduct = async (req, res) => {
//   console.log(req.file);  // Log the file info to check
//   const { name, price, description, category, stock } = req.body;

//   // If a new image is uploaded, use the new image, otherwise keep the existing image
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

//   try {
//     const updatedData = {
//       name,
//       price,
//       description,
//       category,
//       stock,
//     };

//     if (imageUrl) {
//       updatedData.imageUrl = imageUrl;  // Only update the image if a new one was uploaded
//     }

//     const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// };
// Update product (with image upload)
export const updateProduct = async (req, res) => {
  console.log(req.file);  // Log the file info to check
  const { name, price, description, category, stock } = req.body;

  // If a new image is uploaded, use the new image, otherwise keep the existing image
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    // Find the existing product to get the old image URL
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Prepare the updated data
    const updatedData = {
      name,
      price,
      description,
      category,
      stock,
    };

    if (imageUrl) {
      // Delete the old image file if it exists
      if (existingProduct.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', existingProduct.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err);
          } else {
            console.log('Old image deleted successfully:', oldImagePath);
          }
        });
      }
      updatedData.imageUrl = imageUrl;  // Only update the image if a new one was uploaded
    }

    // Update the product with the new data
    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};



// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(204).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
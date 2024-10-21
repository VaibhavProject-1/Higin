import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  lastPurchasedPrice: {
    type: Number,
    default: 0.0,
  },
  imageUrl: {
    type: String, // Storing the image as a URL link
    required: true, // Make it required if all products must have an image
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
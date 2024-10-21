import mongoose from 'mongoose';

// Ordered Product Schema
const orderedProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  quotedPrice: {
    type: Number,
    required: true,
  },
});

// Order Schema
const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  salesOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,  // The sales officer handling this order
  },
  products: [orderedProductSchema],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'REFUNDED', 'CANCELLED'],
    default: 'PENDING',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,  // The delivery location of the order
  },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
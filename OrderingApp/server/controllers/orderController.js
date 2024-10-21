import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Create a new order
// export const createOrder = async (req, res) => {
//   const { customerId, products, total, location, salesOfficer } = req.body;

//   // Validate the input
//   if (!customerId || !products || !total || !location || !salesOfficer) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   // Ensure the total matches product prices (optional validation step)
//   const calculatedTotal = products.reduce((sum, product) => sum + (product.quotedPrice * product.quantity), 0);
//   if (total !== calculatedTotal) {
//     return res.status(400).json({ message: 'Total does not match the sum of quoted product prices.' });
//   }

//   try {
//     // Find the customer and sales officer
//     const customer = await Customer.findById(customerId);
//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }

//     const salesOfficerExists = await User.findById(salesOfficer);
//     if (!salesOfficerExists) {
//       return res.status(404).json({ message: 'Sales officer not found' });
//     }

//     // Create new order
//     const newOrder = new Order({
//       customer: customerId,  // Mongoose will handle ObjectId conversion
//       salesOfficer,          // Mongoose will handle ObjectId conversion
//       products,
//       total,
//       location,
//     });
//     await newOrder.save();

//     // Update sales officer's sales progress for the current month and year
//     const currentYear = new Date().getFullYear();
//     const currentMonth = new Date().toLocaleString('default', { month: 'long' });

//     // Check if the sales progress entry for the current month and year already exists
//     const existingProgressIndex = salesOfficerExists.salesProgress.findIndex(
//       (entry) => entry.year === currentYear && entry.month === currentMonth
//     );

//     if (existingProgressIndex !== -1) {
//       // If entry exists, increment currentSales
//       salesOfficerExists.salesProgress[existingProgressIndex].currentSales += total;
//     } else {
//       // If no entry exists, create a new one for the current month and year
//       salesOfficerExists.salesProgress.push({
//         year: currentYear,
//         month: currentMonth,
//         target: 0,  // Set a default target if needed or set according to the business logic
//         currentSales: total,
//       });
//     }

//     // Save the updated sales officer data
//     await salesOfficerExists.save();

//     return res.status(201).json(newOrder);
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return res.status(500).json({ message: 'Error placing order', error: error.message });
//   }
// };

export const createOrder = async (req, res) => {
  const { customerId, products, total, location, salesOfficer } = req.body;

  // Validate the input
  if (!customerId || !products || !total || !location || !salesOfficer) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find the customer and sales officer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const salesOfficerExists = await User.findById(salesOfficer);
    if (!salesOfficerExists) {
      return res.status(404).json({ message: 'Sales officer not found' });
    }

    // Iterate over each product to check if the quoted price is lower than the original price
    for (const product of products) {
      const dbProduct = await Product.findById(product.product);
      if (product.quotedPrice < dbProduct.price) {
        // If the quoted price is lower than the product price, save it as the last purchased price
        const lastPurchasedPriceIndex = customer.purchasedProducts.findIndex(
          (p) => p.productId.toString() === product.product.toString()
        );

        if (lastPurchasedPriceIndex !== -1) {
          // Update existing last purchased price for this product
          customer.purchasedProducts[lastPurchasedPriceIndex].lastPurchasedPrice = product.quotedPrice;
        } else {
          // Add a new entry for the product's last purchased price
          customer.purchasedProducts.push({
            productId: product.product,
            lastPurchasedPrice: product.quotedPrice,
          });
        }
      }
    }

    // Save the updated customer
    await customer.save();

    // Create new order
    const newOrder = new Order({
      customer: customerId, // Mongoose will handle ObjectId conversion
      salesOfficer,         // Mongoose will handle ObjectId conversion
      products,
      total,
      location,
    });
    await newOrder.save();

    // Update sales officer's sales progress for the current month and year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    // Check if the sales progress entry for the current month and year already exists
    const existingProgressIndex = salesOfficerExists.salesProgress.findIndex(
      (entry) => entry.year === currentYear && entry.month === currentMonth
    );

    if (existingProgressIndex !== -1) {
      // If entry exists, increment currentSales
      salesOfficerExists.salesProgress[existingProgressIndex].currentSales += total;
    } else {
      // If no entry exists, create a new one for the current month and year
      salesOfficerExists.salesProgress.push({
        year: currentYear,
        month: currentMonth,
        target: 0,  // Set a default target if needed or set according to the business logic
        currentSales: total,
      });
    }

    // Save the updated sales officer data
    await salesOfficerExists.save();

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};


// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer')
      .populate('products.product')
      .populate('salesOfficer');  // Populate salesOfficer details
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer')
      .populate('products.product')
      .populate('salesOfficer');  // Populate salesOfficer details
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update order
export const updateOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true })
      .populate('salesOfficer');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Handle completed order logic
    if (order.status === 'COMPLETED') {
      const salesOfficer = await User.findById(order.salesOfficer._id);
      if (salesOfficer) {
        salesOfficer.currentSales += order.total;
        await salesOfficer.save();
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Order deleted successfully' }); // Always return a JSON response
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(400).json({ error: error.message });
  }
};

// In your orders controller
export const getOrdersBySalesOfficer = async (req, res) => {
  try {
    const salesOfficerId = req.params.salesOfficerId; // Get sales officer ID from request parameters
    const orders = await Order.find({ salesOfficer: salesOfficerId }).populate('customer products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};
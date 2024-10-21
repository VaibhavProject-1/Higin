import Customer from '../models/Customer.js';

// Create a new customer
export const createCustomer = async (req, res) => {
    const { name, email, phoneNumber, address } = req.body;
  
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      return res.status(400).json({ message: 'Customer already exists' });
    }
  
    const customer = await Customer.create({ name, email, phoneNumber, address });
    res.status(201).json(customer);
  };

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const { check, validationResult } = require('express-validator');

const validateOrder = [
  check('customer', 'Customer ID is required').not().isEmpty(),
  check('products', 'Products must be an array').isArray(),
  check('products.*.product', 'Each product must have a valid product ID').not().isEmpty(),
  check('products.*.quantity', 'Quantity must be a number').isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateOrder };
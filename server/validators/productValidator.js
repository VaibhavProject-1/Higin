const { check, validationResult } = require('express-validator');

const validateProduct = [
  check('name', 'Product name is required').not().isEmpty(),
  check('price', 'Price must be a number').isNumeric(),
  check('category', 'Category is required').not().isEmpty(),
  check('stock', 'Stock must be a number').isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateProduct };
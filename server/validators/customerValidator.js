const { check, validationResult } = require('express-validator');

const validateCustomer = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please provide a valid email').isEmail(),
  check('phoneNumber', 'Phone number is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateCustomer };
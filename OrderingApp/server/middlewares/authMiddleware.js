import jwt from 'jsonwebtoken';

// Middleware to protect routes and check for valid token
// General authentication middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from headers
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      next();  // Move on to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the user has the 'sales' role
export const checkSalesRole = (req, res, next) => {
  if (req.user && req.user.role === 'sales') {
    next();  // Proceed if user has 'sales' role
  } else {
    res.status(403).json({ message: 'User is not authorized as Sales Officer' });
  }
};

// Middleware to check if the user has the 'admin' role
export const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();  // Proceed if user has 'admin' role
  } else {
    res.status(403).json({ message: 'User is not authorized as Admin' });
  }
};

// Middleware to check if the user has the 'user' role
export const checkUserRole = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();  // Proceed if user has 'user' role
  } else {
    res.status(403).json({ message: 'User is not authorized' });
  }
};

// Middleware to check if the user has either 'sales' or 'admin' role
export const checkSalesOrAdminRole = (req, res, next) => {
  if (req.user && (req.user.role === 'sales' || req.user.role === 'admin')) {
    next();  // Proceed if user has 'sales' or 'admin' role
  } else {
    res.status(403).json({ message: 'User is not authorized as Sales Officer or Admin' });
  }
};
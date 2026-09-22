const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tamal_portfolio_super_secret_jwt_key_2026';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7).trim();

      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ 
          success: false, 
          message: 'No token found. Please login again.' 
        });
      }

      // টোকেন ডিকোড ও ভেরিফাই
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();

    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token. Please login again.' 
      });
    }
  }

  // টোকেন না থাকলে
  return res.status(401).json({ 
    success: false, 
    message: 'Not authorized, no token provided' 
  });
};

module.exports = { protect };
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // 'Bearer ' এর ঠিক পর থেকে পুরো টোকেন স্ট্রিংটি নেওয়া
      const token = authHeader.slice(7).trim();

      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'No token found. Please login again.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

module.exports = { protect };
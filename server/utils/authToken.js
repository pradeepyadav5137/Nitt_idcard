const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const generateApplicationId = (type) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const prefix = type === 'student' ? 'STU' : type === 'faculty' ? 'FAC' : 'STF';
  return `NITT-${prefix}-${year}-${random}`;
};

module.exports = {
  generateToken,
  verifyToken,
  generateApplicationId
};

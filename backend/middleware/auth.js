const jwt = require('jsonwebtoken');
const { db } = require('../database/init');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа не предоставлен' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Middleware для проверки роли пользователя (опционально)
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    next();
  };
};

// Функция для генерации JWT токена
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Функция для получения пользователя по ID
const getUserById = (id) => {
  try {
    return db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  generateToken,
  getUserById,
  JWT_SECRET
}; 
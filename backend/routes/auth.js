const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { db } = require('../database/init');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 *         password:
 *           type: string
 *           description: Пароль пользователя
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Имя пользователя или email
 *         password:
 *           type: string
 *           description: Пароль
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT токен
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Аутентификация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Пользователь уже существует
 */
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Имя пользователя должно содержать от 3 до 30 символов')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Имя пользователя может содержать только буквы, цифры и подчеркивания'),
  body('email')
    .isEmail()
    .withMessage('Введите корректный email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать минимум 6 символов')
], async (req, res) => {
  try {
    // Проверка ошибок валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Ошибка валидации',
        details: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // Проверка существования пользователя
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь с таким именем или email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const result = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).run(username, email, hashedPassword);

    const newUser = {
      id: result.lastInsertRowid,
      username,
      email
    };

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Аутентификация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Неверные учетные данные
 */
router.post('/login', [
  body('username')
    .notEmpty()
    .withMessage('Имя пользователя или email обязательно'),
  body('password')
    .notEmpty()
    .withMessage('Пароль обязателен')
], async (req, res) => {
  try {
    // Проверка ошибок валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Ошибка валидации',
        details: errors.array() 
      });
    }

    const { username, password } = req.body;

    // Поиск пользователя по username или email
    const user = db.prepare(
      'SELECT * FROM users WHERE username = ? OR email = ?'
    ).get(username, username);

    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Генерация токена
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email
    });

    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router; 
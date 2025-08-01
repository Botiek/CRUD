const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Название бренда
 *         description:
 *           type: string
 *           description: Описание бренда
 *         logo_url:
 *           type: string
 *           format: uri
 *           description: URL логотипа
 *         website:
 *           type: string
 *           format: uri
 *           description: Официальный сайт
 *         founded_year:
 *           type: integer
 *           description: Год основания
 *         country:
 *           type: string
 *           description: Страна происхождения
 *         industry:
 *           type: string
 *           description: Отрасль промышленности
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Получить список всех брендов
 *     tags: [Бренды]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество элементов на странице
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию
 *     responses:
 *       200:
 *         description: Список брендов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brands:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Не авторизован
 */
router.get('/', authenticateToken, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query = 'SELECT * FROM brands';
    let countQuery = 'SELECT COUNT(*) as total FROM brands';
    let params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR description LIKE ?';
      countQuery += ' WHERE name LIKE ? OR description LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Получение общего количества
    const countResult = db.prepare(countQuery).get(search ? [`%${search}%`, `%${search}%`] : []);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // Получение брендов
    const brands = db.prepare(query).all(params);

    res.json({
      brands,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Ошибка получения брендов:', error);
    res.status(500).json({ error: 'Ошибка получения данных' });
  }
});

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Получить бренд по ID
 *     tags: [Бренды]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID бренда
 *     responses:
 *       200:
 *         description: Бренд найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Бренд не найден
 *       401:
 *         description: Не авторизован
 */
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(id);

    if (!brand) {
      return res.status(404).json({ error: 'Бренд не найден' });
    }

    res.json(brand);
  } catch (error) {
    console.error('Ошибка получения бренда:', error);
    res.status(500).json({ error: 'Ошибка получения данных' });
  }
});

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Создать новый бренд
 *     tags: [Бренды]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Бренд успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */
router.post('/', authenticateToken, [
  body('name')
    .notEmpty()
    .withMessage('Название бренда обязательно')
    .isLength({ max: 100 })
    .withMessage('Название бренда не должно превышать 100 символов'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Описание не должно превышать 500 символов'),
  body('logo_url')
    .optional()
    .isURL()
    .withMessage('URL логотипа должен быть валидным'),
  body('website')
    .optional()
    .isURL()
    .withMessage('URL сайта должен быть валидным'),
  body('founded_year')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Год основания должен быть между 1800 и текущим годом'),
  body('country')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Название страны не должно превышать 50 символов'),
  body('industry')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Название отрасли не должно превышать 50 символов')
], (req, res) => {
  try {
    // Проверка ошибок валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Ошибка валидации',
        details: errors.array() 
      });
    }

    const { name, description, logo_url, website, founded_year, country, industry } = req.body;

    const result = db.prepare(`
      INSERT INTO brands (name, description, logo_url, website, founded_year, country, industry)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, logo_url, website, founded_year, country, industry);

    const newBrand = {
      id: result.lastInsertRowid,
      name,
      description,
      logo_url,
      website,
      founded_year,
      country,
      industry,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.status(201).json(newBrand);
  } catch (error) {
    console.error('Ошибка создания бренда:', error);
    res.status(500).json({ error: 'Ошибка создания бренда' });
  }
});

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Обновить бренд
 *     tags: [Бренды]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID бренда
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: Бренд успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Бренд не найден
 *       401:
 *         description: Не авторизован
 */
router.put('/:id', authenticateToken, [
  body('name')
    .notEmpty()
    .withMessage('Название бренда обязательно')
    .isLength({ max: 100 })
    .withMessage('Название бренда не должно превышать 100 символов'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Описание не должно превышать 500 символов'),
  body('logo_url')
    .optional()
    .isURL()
    .withMessage('URL логотипа должен быть валидным'),
  body('website')
    .optional()
    .isURL()
    .withMessage('URL сайта должен быть валидным'),
  body('founded_year')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Год основания должен быть между 1800 и текущим годом'),
  body('country')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Название страны не должно превышать 50 символов'),
  body('industry')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Название отрасли не должно превышать 50 символов')
], (req, res) => {
  try {
    // Проверка ошибок валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Ошибка валидации',
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { name, description, logo_url, website, founded_year, country, industry } = req.body;

    // Проверка существования бренда
    const existingBrand = db.prepare('SELECT id FROM brands WHERE id = ?').get(id);
    if (!existingBrand) {
      return res.status(404).json({ error: 'Бренд не найден' });
    }

    db.prepare(`
      UPDATE brands 
      SET name = ?, description = ?, logo_url = ?, website = ?, 
          founded_year = ?, country = ?, industry = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, logo_url, website, founded_year, country, industry, id);

    const updatedBrand = {
      id: parseInt(id),
      name,
      description,
      logo_url,
      website,
      founded_year,
      country,
      industry,
      updated_at: new Date().toISOString()
    };

    res.json(updatedBrand);
  } catch (error) {
    console.error('Ошибка обновления бренда:', error);
    res.status(500).json({ error: 'Ошибка обновления бренда' });
  }
});

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Удалить бренд
 *     tags: [Бренды]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID бренда
 *     responses:
 *       200:
 *         description: Бренд успешно удален
 *       404:
 *         description: Бренд не найден
 *       401:
 *         description: Не авторизован
 */
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Проверка существования бренда
    const existingBrand = db.prepare('SELECT id FROM brands WHERE id = ?').get(id);
    if (!existingBrand) {
      return res.status(404).json({ error: 'Бренд не найден' });
    }

    db.prepare('DELETE FROM brands WHERE id = ?').run(id);

    res.json({ message: 'Бренд успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления бренда:', error);
    res.status(500).json({ error: 'Ошибка удаления бренда' });
  }
});

module.exports = router; 
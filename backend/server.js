const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const brandRoutes = require('./routes/brands');
const { initializeDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка trust proxy для работы за прокси
app.set('trust proxy', 1);

// Middleware безопасности
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
});
app.use(limiter);

// CORS настройки
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Логирование
app.use(morgan('combined'));

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger документация
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Brands CRUD API',
      version: '1.0.0',
      description: 'API для управления брендами',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Brands CRUD API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Что-то пошло не так!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Внутренняя ошибка сервера'
  });
});

// 404 обработчик
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Инициализация базы данных и запуск сервера
async function startServer() {
  try {
    await initializeDatabase();
    console.log('База данных инициализирована');
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`API документация: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Ошибка запуска сервера:', error);
    process.exit(1);
  }
}

startServer(); 
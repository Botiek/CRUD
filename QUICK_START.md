# 🚀 Быстрый запуск CRUD приложения для управления брендами

## 📋 Предварительные требования

- Docker и Docker Compose
- Node.js 18+ (для локального запуска)
- Git

## 🐳 Вариант 1: Docker (рекомендуется)

```bash
# 1. Клонировать репозиторий
git clone <repository-url>
cd brands-crud-app

# 2. Запустить приложение
docker-compose up --build

# 3. Открыть в браузере
# Frontend: http://localhost:3000
# API Docs: http://localhost:5000/api-docs
```

## 💻 Вариант 2: Локальный запуск

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend (в новом терминале)
```bash
cd frontend
npm install
npm start
```

## 🔑 Вход в систему

- **Логин**: `admin`
- **Пароль**: `admin123`

## 📚 API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация

### Бренды
- `GET /api/brands` - Получить список брендов
- `GET /api/brands/:id` - Получить бренд по ID
- `POST /api/brands` - Создать новый бренд
- `PUT /api/brands/:id` - Обновить бренд
- `DELETE /api/brands/:id` - Удалить бренд

## 🛠️ Разработка

### Запуск тестов
```bash
# Backend тесты
cd backend
npm test

# Frontend тесты
cd frontend
npm test
```

### Линтинг
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## 📦 Структура проекта

```
brands-crud-app/
├── backend/                 # Node.js + Express API
│   ├── database/           # База данных SQLite
│   ├── middleware/         # JWT аутентификация
│   ├── routes/            # API маршруты
│   └── tests/             # Тесты
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   └── contexts/      # React контексты
│   └── public/           # Статические файлы
├── docker-compose.yml    # Docker конфигурация
└── README.md            # Подробная документация
```

## 🔧 Технологии

### Backend
- Node.js + Express
- SQLite (база данных)
- JWT (аутентификация)
- Swagger (документация API)
- Jest (тестирование)

### Frontend
- React + TypeScript
- Material-UI (UI компоненты)
- Axios (HTTP клиент)
- React Router (маршрутизация)

### DevOps
- Docker + Docker Compose
- ESLint (линтинг)
- GitHub Actions (CI/CD) 
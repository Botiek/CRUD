# CRUD Приложение для управления брендами

Полноценное веб-приложение для управления брендами с backend API и frontend интерфейсом.

## 🚀 Особенности

- ✅ **Полный CRUD** для управления брендами
- 🔐 **JWT аутентификация** с защищенными маршрутами
- 📱 **Современный UI** на Material-UI
- 🔍 **Поиск и пагинация** в таблице брендов
- 📊 **Swagger документация** API
- 🐳 **Docker контейнеризация**
- 🧪 **Тесты** для backend
- 📝 **ESLint** для качества кода
- 🔄 **CI/CD** с GitHub Actions

## 🛠 Технологии

### Backend
- **Node.js** с **Express.js**
- **JWT** аутентификация
- **SQLite** база данных
- **Swagger/OpenAPI** документация
- **CORS** поддержка
- **Express Validator** для валидации
- **Helmet** для безопасности

### Frontend
- **React** с **TypeScript**
- **Material-UI** для интерфейса
- **Axios** для API запросов
- **React Router** для навигации
- **Context API** для управления состоянием

### DevOps
- **Docker** и **Docker Compose**
- **ESLint** для линтинга
- **GitHub Actions** для CI/CD

## 🚀 Быстрый запуск

### С Docker (рекомендуется)

```bash
# Клонировать репозиторий
git clone https://github.com/Botiek/CRUD
cd brands-crud-app

# Запустить с Docker Compose
docker-compose up --build
```

Приложение будет доступно по адресам:
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:5000
- 📚 **API Документация**: http://localhost:5000/api-docs

### Локальный запуск

#### Backend
```bash
cd backend
npm install
cp env.example .env  # Настройка переменных окружения
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔑 Тестовые данные

Для входа в систему используйте:
- **Логин**: `admin`
- **Пароль**: `admin123`

## 📡 API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация

### Бренды
- `GET /api/brands` - Получить все бренды (с пагинацией и поиском)
- `GET /api/brands/:id` - Получить бренд по ID
- `POST /api/brands` - Создать новый бренд
- `PUT /api/brands/:id` - Обновить бренд
- `DELETE /api/brands/:id` - Удалить бренд

## 📁 Структура проекта

```
brands-crud-app/
├── backend/                    # Node.js/Express API
│   ├── database/              # Инициализация БД
│   ├── middleware/            # JWT аутентификация
│   ├── routes/                # API маршруты
│   ├── tests/                 # Тесты
│   ├── server.js              # Основной сервер
│   └── package.json
├── frontend/                   # React приложение
│   ├── public/                # Статические файлы
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── contexts/          # Context API
│   │   ├── App.tsx            # Главный компонент
│   │   └── index.tsx          # Точка входа
│   └── package.json
├── docker-compose.yml          # Docker конфигурация
├── .github/workflows/          # CI/CD
└── README.md                   # Документация
```

## 🧪 Тестирование

### Backend тесты
```bash
cd backend
npm test
```

### Frontend тесты
```bash
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

## 🔧 Разработка

### Переменные окружения

Создайте файл `.env` в папке `backend` на основе `env.example`:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

### Добавление новых функций

1. **Backend**: Добавьте новые маршруты в `backend/routes/`
2. **Frontend**: Создайте новые компоненты в `frontend/src/components/`
3. **Тесты**: Напишите тесты для новых функций
4. **Документация**: Обновите Swagger документацию

## 🚀 Развертывание

### Вариант 1: Vercel (Frontend) + Railway (Backend)

#### Frontend на Vercel
```bash
cd frontend
npm run build
vercel --prod
```

#### Backend на Railway
```bash
cd backend
railway login
railway init
railway up
```

### Вариант 2: Netlify (Frontend) + Render (Backend)

#### Frontend на Netlify
```bash
cd frontend
npm run build
# Загрузите папку build/ на Netlify
```

#### Backend на Render
```bash
cd backend
# Создайте новый Web Service на Render
# Укажите build command: npm install
# Укажите start command: npm start
```

### Вариант 3: GitHub Pages (Frontend) + Heroku (Backend)

#### Frontend на GitHub Pages
```bash
cd frontend
npm run build
# Настройте GitHub Pages в настройках репозитория
```

#### Backend на Heroku
```bash
cd backend
heroku create your-app-backend
git subtree push --prefix backend heroku main
```

### Переменные окружения для продакшена

Убедитесь, что установлены следующие переменные окружения:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-very-secure-secret-key
FRONTEND_URL=https://your-frontend-domain.com
```

## 📊 Мониторинг и логи

- Логи приложения выводятся в консоль
- Swagger UI для тестирования API
- Валидация данных на backend и frontend

## 🔒 Безопасность

- JWT токены с истечением срока действия
- Хеширование паролей с bcrypt
- Валидация входных данных
- CORS настройки
- Rate limiting
- Helmet для защиты заголовков

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

Если у вас есть вопросы или проблемы:
1. Проверьте [Issues](../../issues)
2. Создайте новое issue с описанием проблемы
3. Убедитесь, что проблема не была уже решена

---

⭐ Если проект вам понравился, поставьте звездочку! 

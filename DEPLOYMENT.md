# 🚀 Руководство по развертыванию

## 📋 Обзор

Это руководство поможет вам развернуть CRUD приложение для управления брендами на различных платформах.

## 🎯 Варианты развертывания

### Вариант 1: Vercel (Frontend) + Railway (Backend) - РЕКОМЕНДУЕТСЯ

#### Frontend на Vercel

1. **Подготовка проекта**
   ```bash
   cd frontend
   npm run build
   ```

2. **Деплой на Vercel**
   ```bash
   # Установите Vercel CLI
   npm i -g vercel
   
   # Войдите в аккаунт
   vercel login
   
   # Деплой
   vercel --prod
   ```

3. **Настройка переменных окружения**
   - `REACT_APP_API_URL` = URL вашего backend API

#### Backend на Railway

1. **Подготовка проекта**
   ```bash
   cd backend
   ```

2. **Деплой на Railway**
   ```bash
   # Установите Railway CLI
   npm i -g @railway/cli
   
   # Войдите в аккаунт
   railway login
   
   # Инициализируйте проект
   railway init
   
   # Деплой
   railway up
   ```

3. **Настройка переменных окружения**
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-very-secure-secret-key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

### Вариант 2: Netlify (Frontend) + Render (Backend)

#### Frontend на Netlify

1. **Подготовка проекта**
   ```bash
   cd frontend
   npm run build
   ```

2. **Деплой на Netlify**
   - Загрузите папку `build/` на Netlify
   - Или подключите GitHub репозиторий

3. **Настройка переменных окружения**
   - `REACT_APP_API_URL` = URL вашего backend API

#### Backend на Render

1. **Создание Web Service**
   - Создайте новый Web Service на Render
   - Подключите GitHub репозиторий
   - Укажите папку: `backend`

2. **Настройка сборки**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Настройка переменных окружения**
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-very-secure-secret-key
   FRONTEND_URL=https://your-frontend-domain.netlify.app
   ```

### Вариант 3: GitHub Pages (Frontend) + Heroku (Backend)

#### Frontend на GitHub Pages

1. **Подготовка проекта**
   ```bash
   cd frontend
   npm run build
   ```

2. **Настройка GitHub Pages**
   - В настройках репозитория включите GitHub Pages
   - Укажите папку `build/` как источник

3. **Настройка переменных окружения**
   - `REACT_APP_API_URL` = URL вашего backend API

#### Backend на Heroku

1. **Подготовка проекта**
   ```bash
   cd backend
   ```

2. **Деплой на Heroku**
   ```bash
   # Установите Heroku CLI
   # Создайте приложение
   heroku create your-app-backend
   
   # Деплой
   git subtree push --prefix backend heroku main
   ```

3. **Настройка переменных окружения**
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-very-secure-secret-key
   FRONTEND_URL=https://your-username.github.io/your-repo
   ```

## 🔧 Настройка базы данных

### Для продакшена рекомендуется:

1. **PostgreSQL** (Railway, Render, Heroku)
2. **MongoDB Atlas** (бесплатный кластер)
3. **Supabase** (бесплатная PostgreSQL)

### Обновление backend для PostgreSQL

1. **Установите зависимости**
   ```bash
   cd backend
   npm install pg
   ```

2. **Обновите database/init.js**
   ```javascript
   const { Pool } = require('pg');
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });
   ```

## 🔒 Безопасность

### Обязательные настройки для продакшена:

1. **JWT Secret**
   - Используйте длинный случайный ключ
   - Минимум 32 символа
   - Пример: `crypto.randomBytes(64).toString('hex')`

2. **CORS настройки**
   - Укажите точный домен frontend
   - Не используйте `*` в продакшене

3. **Rate Limiting**
   - Ограничьте количество запросов
   - Настройте блокировку при превышении лимита

4. **Helmet**
   - Включите все заголовки безопасности
   - Настройте CSP политики

## 📊 Мониторинг

### Рекомендуемые инструменты:

1. **Логирование**
   - Winston для структурированных логов
   - Sentry для отслеживания ошибок

2. **Мониторинг производительности**
   - New Relic (бесплатный план)
   - DataDog (бесплатный план)

3. **Uptime мониторинг**
   - UptimeRobot (бесплатно)
   - Pingdom (бесплатный план)

## 🚨 Troubleshooting

### Частые проблемы:

1. **CORS ошибки**
   - Проверьте настройки CORS в backend
   - Убедитесь, что FRONTEND_URL указан правильно

2. **JWT ошибки**
   - Проверьте JWT_SECRET
   - Убедитесь, что токены не истекли

3. **Проблемы с базой данных**
   - Проверьте подключение к БД
   - Убедитесь, что таблицы созданы

4. **Проблемы с переменными окружения**
   - Проверьте все обязательные переменные
   - Убедитесь в правильности значений

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи приложения
2. Убедитесь, что все переменные окружения настроены
3. Проверьте документацию платформы
4. Создайте issue в репозитории

---

**Удачного деплоя! 🎉** 
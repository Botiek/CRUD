FROM node:18

WORKDIR /app

# Установка необходимых зависимостей для сборки better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода
COPY . .

# Создание пользователя для безопасности
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Создание директории для базы данных и установка прав
RUN mkdir -p /app/database && chown -R nodejs:nodejs /app
USER nodejs

# Открытие порта
EXPOSE 5000

# Запуск приложения
CMD ["npm", "start"] 
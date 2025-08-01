const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'brands.db');
const db = new Database(dbPath);

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Создание таблицы пользователей
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Создание таблицы брендов
      db.exec(`
        CREATE TABLE IF NOT EXISTS brands (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          logo_url TEXT,
          website TEXT,
          founded_year INTEGER,
          country TEXT,
          industry TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Создание индексов для оптимизации
      db.exec('CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name)');
      db.exec('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
      db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');

      // Добавление тестовых данных
      const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
      
      if (userCount.count === 0) {
        // Создание тестового пользователя
        const testPassword = bcrypt.hashSync('admin123', 10);
        db.prepare(`
          INSERT INTO users (username, email, password)
          VALUES (?, ?, ?)
        `).run(['admin', 'admin@example.com', testPassword]);
      }

      const brandCount = db.prepare('SELECT COUNT(*) as count FROM brands').get();
      
      if (brandCount.count === 0) {
        // Добавление тестовых брендов
        const testBrands = [
          {
            name: 'Apple',
            description: 'Американская корпорация, производитель персональных и планшетных компьютеров',
            logo_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
            website: 'https://www.apple.com',
            founded_year: 1976,
            country: 'США',
            industry: 'Технологии'
          },
          {
            name: 'Nike',
            description: 'Американская компания, производитель спортивной одежды и обуви',
            logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Nike_Logo.svg',
            website: 'https://www.nike.com',
            founded_year: 1964,
            country: 'США',
            industry: 'Спорт'
          },
          {
            name: 'Coca-Cola',
            description: 'Американская компания, производитель безалкогольных напитков',
            logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg',
            website: 'https://www.coca-cola.com',
            founded_year: 1886,
            country: 'США',
            industry: 'Напитки'
          }
        ];

        const insertBrand = db.prepare(`
          INSERT INTO brands (name, description, logo_url, website, founded_year, country, industry)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        testBrands.forEach(brand => {
          insertBrand.run([
            brand.name,
            brand.description,
            brand.logo_url,
            brand.website,
            brand.founded_year,
            brand.country,
            brand.industry
          ]);
        });
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  db,
  initializeDatabase
}; 
const express = require('express');
const db = require('./config/database');
const resumeRoutes = require('./routes/resumeRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST',
}));
app.use(express.json()); // Парсинг JSON

// Инициализация базы данных
async function initializeDatabase() {
    try {
        await db.connect('CV_API.db');
    } catch (error) {
        console.error('Ошибка подключения к базе данных:', error);
        process.exit(1);
    }
}

// Маршруты API
app.use('/api/resumes', resumeRoutes);
app.use('/api/contacts', contactRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
    res.json({
        message: 'CV API работает',
        version: '1.0.0',
        endpoints: {
            resumes: '/api/resumes',
            contacts: '/api/contacts'
        }
    });
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Маршрут не найден'
    });
});

// Запуск сервера
async function startServer() {
    await initializeDatabase();

    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);

// Корректное завершение работы
process.on('SIGINT', () => {
    console.log('Завершение работы сервера...');
    db.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Получен сигнал завершения работы...');
    db.close();
    process.exit(0);
});
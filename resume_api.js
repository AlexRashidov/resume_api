const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require("cors");
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('CV_API.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Подключено к SQLite базе данных');
    }
});
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],

}));

app.get('/resume/list', function (req,res) {
    db.all("SELECT * FROM resume", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Закрытие соединения с БД при завершении
process.on('SIGINT', () => {
    db.close();
    process.exit();
});
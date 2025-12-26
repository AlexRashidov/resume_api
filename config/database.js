const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor() {
        this.db = null;
    }

    connect(databasePath) {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(databasePath, (err) => {
                if (err) {
                    console.error('Ошибка подключения к базе данных:', err);
                    reject(err);
                } else {
                    console.log('Подключено к SQLite базе данных');
                    resolve(this.db);
                }
            });
        });
    }

    getDB() {
        if (!this.db) {
            throw new Error('База данных не инициализирована');
        }
        return this.db;
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Ошибка закрытия базы данных:', err);
                } else {
                    console.log('Соединение с базой данных закрыто');
                }
            });
        }
    }
}

module.exports = new Database();
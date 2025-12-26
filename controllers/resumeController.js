const db = require('../config/database');

class ResumeController {
    async getAllResumes(req, res) {
        try {
            const database = db.getDB();

            database.all("SELECT * FROM resume", [], (err, rows) => {
                if (err) {
                    console.error('Ошибка получения резюме:', err);
                    return res.status(500).json({
                        success: false,
                        error: 'Ошибка сервера при получении данных'
                    });
                }

                res.json({
                    success: true,
                    data: rows,
                    count: rows.length
                });
            });
        } catch (error) {
            console.error('Ошибка в контроллере резюме:', error);
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера'
            });
        }
    }
}

module.exports = new ResumeController();
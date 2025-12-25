const db = require('../config/database');

// Выносим утилитарные функции отдельно
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .trim()
        .replace(/[<>]/g, '')
        .substring(0, 1000);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

class ContactController {
    async sendMeMessage(req, res) {
        try {
            const { company_name, email, message } = req.body;

            // Валидация
            if (!company_name || !email || !message) {
                return res.status(400).json({
                    success: false,
                    error: "Заполните обязательные поля: company_name, email, message"
                });
            }

            // Валидация email
            if (!validateEmail(email)) {
                return res.status(400).json({
                    success: false,
                    error: "Некорректный формат email"
                });
            }

            // Очистка данных от XSS
            const cleanCompany = sanitizeInput(company_name);
            const cleanEmail = sanitizeInput(email);
            const cleanMessage = sanitizeInput(message);

            const database = db.getDB();

            database.run(
                'INSERT INTO feedback (company_name, email, message) VALUES (?, ?, ?)',
                [cleanCompany, cleanEmail, cleanMessage],
                function(err) {
                    if (err) {
                        console.error('Ошибка отправки сообщения:', err);
                        return res.status(500).json({
                            success: false,
                            error: 'Не удалось сохранить сообщение в базу данных'
                        });
                    }

                    console.log('Новое сообщение от компании:', cleanCompany, 'ID:', this.lastID);

                    res.status(201).json({
                        success: true,
                        message: "Сообщение успешно сохранено",
                        data: {
                            id: this.lastID,
                            company_name: cleanCompany,
                            email: cleanEmail,
                            created_at: new Date().toISOString()
                        }
                    });
                }
            );
        } catch (error) {
            console.error('Ошибка в контроллере контактов:', error);
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера'
            });
        }
    }
}

module.exports = new ContactController();
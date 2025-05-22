const { Router } = require('express');
const db = require('../models');
const Student = db.Student;
const auth = require('../middleware/auth.middleware');

const router = Router();

// Получение данных студента
router.get('/', auth, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { userId: req.user.userId }
        });

        if (!student) {
            return res.status(404).json({ message: 'Профиль студента не найден' });
        }

        res.json(student);
    } catch (e) {
        return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

// Обновление данных студента
router.post('/setting', auth, async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: 'Заполните все поля' });
        }

        const [updated] = await Student.update(
            { name, phone },
            {
                where: { userId: req.user.userId },
                returning: true
            }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Профиль студента не найден' });
        }

        return res.json({ message: 'Данные успешно обновлены' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Ошибка при обновлении данных' });
    }
});

module.exports = router;
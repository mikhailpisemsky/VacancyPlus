const { Router } = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/auth.middleware');

const router = Router();

// Получение данных студента
router.get('/', auth, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { email: req.user.email }
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

        await Student.update(
            { name, phone },
            {
                where: { email: req.user.email },
                returning: true
            }
        );

        return res.status(201).json({ message: 'Данные успешно обновлены' });
    } catch (e) {
        return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

module.exports = router;
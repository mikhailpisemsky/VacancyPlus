const { Router } = require('express');
const Employer = require('../models/Employer');
const auth = require('../middleware/auth.middleware');

const router = Router();

// Получение данных работодателя
router.get('/', auth, async (req, res) => {
    try {
        const employer = await Employer.findOne({
            where: { email: req.user.email }
        });

        if (!employer) {
            return res.status(404).json({ message: 'Профиль работодателя не найден' });
        }

        res.json(employer);
    } catch (e) {
        return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

// Обновление данных работодателя
router.post('/setting', auth, async (req, res) => {
    try {
        const { name, phone } = req.body;

        await Employer.update(
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
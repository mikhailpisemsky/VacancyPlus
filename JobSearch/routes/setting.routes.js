const { Router } = require('express');
const db = require('../models');
const Student = db.Student;
const Employer = db.Employer;
const auth = require('../middleware/auth.middleware');

const router = Router();

// Получение данных студента
router.get('/student', auth, async (req, res) => {
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
router.post('/student/setting', auth, async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (name && name.length < 2) {
            return res.status(400).json({ message: 'ФИО должно быть не менее 2 символов' });
        }

        if (phone && !/^$|^[\+\d\s\-\(\)]{5,20}$/i.test(phone)) {
            return res.status(400).json({ message: 'Некорректный формат телефона' });
        }

        const student = await Student.findOne({
            where: { email: req.user.email }
        });

        if (!student) {
            return res.status(404).json({ message: 'Профиль студента не найден' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;

        await student.update(updateData);

        return res.status(200).json({ message: 'Данные успешно обновлены' });

    } catch (e) {
        console.error('Ошибка обновления данных студента:', e);
        return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

// Получение данных работодателя
router.get('/employer', auth, async (req, res) => {
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
router.post('/employer/setting', auth, async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (name && name.length < 2) {
            return res.status(400).json({ message: 'ФИО должно быть не менее 2 символов' });
        }

        if (phone && !/^$|^[\+\d\s\-\(\)]{5,20}$/i.test(phone)) {
            return res.status(400).json({ message: 'Некорректный формат телефона' });
        }

        const employer = await Employer.findOne({
            where: { email: req.user.email }
        });

        if (!employer) {
            return res.status(404).json({ message: 'Профиль работодателя не найден' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;

        await employer.update(updateData);

        return res.status(200).json({ message: 'Данные успешно обновлены' });

    } catch (e) {
        console.error('Ошибка обновления данных работодателя:', e);
        return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

module.exports = router;
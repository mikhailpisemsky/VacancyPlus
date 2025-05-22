const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../models');
const User = db.User;
const Student = db.Student; //Импорт модели Student
const Employer = db.Employer; //Импорт модели Employer
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Неверный email').isEmail(),
        check('password', 'Минимальная длина пароля: 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Неверные данные при регистрации'
                });
            }

            const { email, password, status } = req.body;

            // Поиск пользователя с использованием Sequelize
            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' });
            }

            if(!(status in ['student',  'employer'])) {
                return res.status(400).json({ message: 'Вы не выбрали статус' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            // Создание пользователя через Sequelize
            await User.create({
                email,
                password: hashedPassword,
                status
            });

            if (status == "student") {
                await Student.create({
                    email
                });
            }

            if (status == "employer") {
                await Employer.create({
                    email
                });
            }

            return res.status(201).json({ message: 'Пользователь создан' });

        } catch (e) {
            console.error('Ошибка при регистрации:', e);
            return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    }
);
// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Неверный email').normalizeEmail().isEmail(),
        check('password', 'Неверный пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Неправильные данные при авторизации'
                });
            }

            const { email, password, status } = req.body;

            // Поиск пользователя через Sequelize
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            if (status != user.status) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            // Создание JWT токена
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                config.get('jwtSecret'),
                { expiresIn: '5h' }
            );

            res.json({ token, userId: user.id, userStatus: status });

        } catch (e) {
            console.error('Ошибка авторизации:', e);
            return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    }
);

module.exports = router;
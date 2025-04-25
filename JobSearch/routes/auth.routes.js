const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/User'); // Импорт модели User
const router = Router();

// Регистрация пользователя
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                });
            }

            const { email, password, status } = req.body;

            // Поиск пользователя с использованием Sequelize
            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            // Создание пользователя через Sequelize
            const user = await User.create({
                email,
                password: hashedPassword,
                status
            });

            await user.save()

            res.status(201).json({ message: 'Пользователь создан' });

        } catch (e) {
            console.error('Ошибка регистрации:', e);
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    }
);
// Авторизация пользователя
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                });
            }

            const { email, password } = req.body;

            // Поиск пользователя через Sequelize
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            // Создание JWT токена
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({ token, userId: user.id });

        } catch (e) {
            console.error('Ошибка авторизации:', e);
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    }
);

module.exports = router;
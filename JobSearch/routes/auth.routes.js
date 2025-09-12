const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../models');
const User = db.User;
const sequelize = require('../config/db');
const Student = db.Student;
const Employer = db.Employer;
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

            const candidate = await User.findOne({
                where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('email')),
                    sequelize.fn('lower', email)
                )
            });

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = await User.create({
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                status
            });

            if (status === "student") {
                await Student.create({ userId: newUser.id, email: newUser.email });
            } else if (status === "employer") {
                await Employer.create({ userId: newUser.id, email: newUser.email });
            }

            return res.status(201).json({ message: 'Пользователь создан', userId: newUser.id });

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

            const user = await User.findOne({
                where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('email')),
                    sequelize.fn('lower', email)
                )
            });

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            if (status !== user.status) {
                return res.status(400).json({ message: 'Неверный тип аккаунта' });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    status: user.status
                },
                config.get('jwtSecret'),
                { expiresIn: '5h' }
            );

            res.json({ token, userId: user.id, userStatus: user.status });

        } catch (e) {
            console.error('Ошибка авторизации:', e);
            return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
        }
    }
);

module.exports = router;
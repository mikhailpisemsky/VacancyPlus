const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/User'); // Импорт модели User
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Minimum password length 6 characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            console.log('Body', req.body)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data during registration'
                });
            }

            const { email, password, status } = req.body;

            // Поиск пользователя с использованием Sequelize
            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return res.status(400).json({ message: 'Such a user already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            // Создание пользователя через Sequelize
            await User.create({
                email,
                password: hashedPassword,
                status
            });

            res.status(201).json({ message: 'User created' });

        } catch (e) {
            console.error('Registration error:', e);
            res.status(500).json({ message: 'Something went wrong, try again' });
        }
    }
);
// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Enter a valid email').normalizeEmail().isEmail(),
        check('password', 'Enter your password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect login information'
                });
            }

            const { email, password } = req.body;

            // Поиск пользователя через Sequelize
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            // Создание JWT токена
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({ token, userId: user.id });

        } catch (e) {
            console.error('Authorization error:', e);
            res.status(500).json({ message: 'Something went wrong, try again' });
        }
    }
);

module.exports = router;
const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { sequelize } = require('../config/db')
const db = require('../models');;
const Vacancy = db.Vacancy;
const NamePosition = db.NamePosition;
const EmployerVacancy = db.EmployerVacancy;
const auth = require('../middleware/auth.middleware');

const router = Router();

const vacancyValidation = [
    check('positionName', 'Название позиции обязательно').notEmpty().trim().isLength({ min: 3, max: 100 }),
    check('vacancyType', 'Тип вакансии обязателен').isIn([
        'полная занятость',
        'частичная занятость',
        'удалённая работа',
        'ассистент преподавателя',
        'помощь в административных отделах',
        'участие в исследовательских проектах',
        'стажировка в партнёрских организациях'
    ]),
    check('vacancyDescription', 'Описание должно быть от 10 до 2000 символов').isLength({ min: 10, max: 2000 }),
    check('companyName', 'Название компании обязательно').notEmpty().trim().isLength({ min: 3, max: 100 })
];

router.post('/add', auth, vacancyValidation, async (req, res) => {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: 'Некорректные данные вакансии'
        });
    }

    const { positionName, vacancyType, companyName, vacancyDescription } = req.body;
    const employerId = req.user.userId;

    // Проверка подключения к БД
    if (!sequelize || !sequelize.authenticate) {
        return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
    }

    let transaction;
    try {
        // Проверяем соединение перед созданием транзакции
        await sequelize.authenticate();

        // Создаем транзакцию
        transaction = await sequelize.transaction();
        if (!transaction || typeof transaction.rollback !== 'function') {
            throw new Error('Не удалось создать транзакцию');
        }

        // 1. Находим или создаем позицию
        const [position] = await NamePosition.findOrCreate({
            where: {
                position: sequelize.where(
                    sequelize.fn('lower', sequelize.col('position')),
                    sequelize.fn('lower', positionName)
                )
            },
            defaults: {
                position: positionName.trim()
            },
            transaction
        });

        // 2. Создаем вакансию
        const vacancy = await Vacancy.create({
            vacancyType,
            positionId: position.positionId,
            companyName,
            vacancyDescription,
            vacancyStatus: 'создана'
        }, { transaction });

        // 3. Связываем с работодателем
        await EmployerVacancy.create({
            vacancyId: vacancy.vacancyId,
            employerId
        }, { transaction });

        // Фиксируем транзакцию
        await transaction.commit();

        return res.status(201).json({
            message: 'Вакансия успешно создана',
            vacancyId: vacancy.vacancyId,
            positionId: position.positionId,
            positionCreated: position._options.isNewRecord
        });

    } catch (error) {
        // Безопасный откат транзакции
        if (transaction && typeof transaction.rollback === 'function') {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error('Ошибка при откате транзакции:', rollbackError);
            }
        }

        console.error('Ошибка при создании вакансии:', error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                message: 'Указанный работодатель не существует'
            });
        }

        if (error.message.includes('транзакция')) {
            return res.status(500).json({
                message: 'Ошибка при работе с базой данных'
            });
        }

        return res.status(500).json({
            message: 'Ошибка сервера при создании вакансии',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
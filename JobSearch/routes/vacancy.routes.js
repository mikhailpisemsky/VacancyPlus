const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { sequelize } = require('../config/db');
const Vacancy = require('../models/Vacancy');
const Position = require('../models/Position');
const EmployerVacancy = require('../models/EmployersVacancies');
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
    check('vacancyDescription', 'Описание должно быть от 10 до 2000 символов').isLength({ min: 10, max: 2000 })
];

router.post('/add', auth, vacancyValidation, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные вакансии'
            });
        }

        const { positionName, vacancyType, vacancyDescription, employerId } = req.body;

        // 1. Находим или создаем позицию
        const [position] = await Position.findOrCreate({
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
            vacancyDescription,
            vacancyStatus: 'создана'
        }, { transaction });

        // 3. Связываем с работодателем
        await EmployerVacancy.create({
            vacancyId: vacancy.vacancyId,
            employerId
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            message: 'Вакансия успешно создана',
            vacancyId: vacancy.vacancyId,
            positionId: position.positionId,
            positionCreated: position._options.isNewRecord // Была ли создана новая позиция
        });

    } catch (e) {
        await transaction.rollback();
        console.error('Ошибка при создании вакансии:', e);

        if (e.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                message: 'Указанный работодатель не существует'
            });
        }

        res.status(500).json({
            message: 'Ошибка сервера при создании вакансии',
            error: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});

module.exports = router;
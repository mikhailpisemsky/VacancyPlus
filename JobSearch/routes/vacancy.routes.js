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
    console.log('User making request:', req.user);
    console.log('Request body:', req.body);
    // Проверка что пользователь работодатель
    if (req.user.status !== 'employer') {
        return res.status(403).json({ message: 'Только работодатели могут создавать вакансии' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: 'Некорректные данные вакансии'
        });
    }

    const { positionName, vacancyType, companyName, min_salary, max_salary, vacancyDescription } = req.body;
    const employerId = req.user.userId;

    // Нормализация зарплат
    const minSalary = min_salary !== undefined ? Number(min_salary) : null;
    const maxSalary = max_salary !== undefined ? Number(max_salary) : null;

    let transaction;
    try {
        await sequelize.authenticate();
        transaction = await sequelize.transaction();

        // 1. Находим или создаем позицию
        const [position] = await NamePosition.findOrCreate({
            where: {
                position: sequelize.where(
                    sequelize.fn('lower', sequelize.col('position')),
                    sequelize.fn('lower', positionName)
                )
            },
            defaults: { position: positionName.trim() },
            transaction
        });

        // 2. Создаем вакансию
        const vacancy = await Vacancy.create({
            vacancyType,
            positionId: position.positionId,
            companyName: companyName.trim(),
            min_salary: minSalary,
            max_salary: maxSalary,
            vacancyDescription: vacancyDescription.trim(),
            vacancyStatus: 'создана'
        }, { transaction });

        // 3. Связываем с работодателем
        await EmployerVacancy.create({
            vacancyId: vacancy.vacancyId,
            employerId
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({
            message: 'Вакансия успешно создана',
            vacancyId: vacancy.vacancyId
        });

    } catch (error) {
        if (transaction) await transaction.rollback();

        console.error('Ошибка:', error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ message: 'Ошибка связей данных' });
        }

        return res.status(500).json({
            message: 'Ошибка сервера',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
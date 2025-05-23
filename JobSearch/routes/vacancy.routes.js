const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const sequelize = require('../config/db');
const db = require('../models');;
const Vacancy = db.Vacancy;
const NamePosition = db.NamePosition;
const EmployerVacancy = db.EmployerVacancy;
const Employer = db.Employer;
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
    const minSalary = min_salary !== undefined ? Number(min_salary) : null;
    const maxSalary = max_salary !== undefined ? Number(max_salary) : null;

    let transaction;
    try {
        const user = await db.User.findOne({
            where: { email: req.user.email }
        })

        const employer = await Employer.findOne({
            where: { email : req.user.email }
        });

        if (!employer) {
            return res.status(404).json({ message: 'Профиль работодателя не найден' });
        }

        transaction = await sequelize.transaction();

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

        const vacancy = await Vacancy.create({
            vacancyType,
            positionId: position.positionId,
            companyName: companyName.trim(),
            min_salary: minSalary,
            max_salary: maxSalary,
            vacancyDescription: vacancyDescription.trim(),
            vacancyStatus: 'created'
        }, { transaction });

        await EmployerVacancy.create({
            vacancyId: vacancy.vacancyId,
            employerId: employer.employerId,
        }, {
            transaction,
            fields: ['vacancyId', 'employerId']
        });

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


router.get('/:id', auth, async (req, res) => {
    try {
        const employer = await Employer.findOne({
            where: { email: req.user.email }
        });
        const vacancy = await db.Vacancy.findOne({
            where: { vacancyId: req.params.id },
            include: [
                {
                    model: db.NamePosition,
                    as: 'position',
                    attributes: ['position']
                },
                {
                    model: db.EmployerVacancy,
                    as: 'vacancyOwners',
                    where: { employerId: employer.employerId },
                    required: true
                }
            ]
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        res.json({
            id: vacancy.vacancyId,
            position: vacancy.position?.position || 'Не указано',
            type: vacancy.vacancyType,
            company: vacancy.companyName,
            minSalary: vacancy.min_salary,
            maxSalary: vacancy.max_salary,
            description: vacancy.vacancyDescription,
            status: vacancy.vacancyStatus,
            contactPerson: employer.name,
            contactEmail: req.user.email,
            contactPhone: employer.phone,
            createdAt: vacancy.createdAt
        });

    } catch (e) {
        console.error('Ошибка при получении вакансии:', e);
        res.status(500).json({ message: 'Не удалось загрузить вакансию' });
    }
});
module.exports = router;
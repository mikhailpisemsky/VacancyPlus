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

//Создание вакансии
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

//Просмотр отдельной вакансии
router.get('/:id', auth, async (req, res) => {
    try {
        console.log(`Запрос вакансии ID: ${req.params.id} от пользователя типа: ${req.user.status}`);
        const userType = req.user.status;
        let vacancy;

        if (userType === 'employer') {
            const employer = await db.Employer.findOne({
                where: { email: req.user.email }
            });

            vacancy = await db.Vacancy.findOne({
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
                        required: true,
                        include: [{
                            model: db.Employer,
                            as: 'employer'
                        }]
                    }
                ]
            });

            if (!vacancy) {
                return res.status(404).json({ message: 'Вакансия не найдена или вам недоступна' });
            }

            return res.json({
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
        } else if (userType === 'student') {
            vacancy = await db.Vacancy.findOne({
                where: {
                    vacancyId: req.params.id
                },
                include: [
                    {
                        model: db.NamePosition,
                        as: 'position',
                        attributes: ['position']
                    },
                    {
                        model: db.EmployerVacancy,
                        as: 'vacancyOwners',
                        include: [{
                            model: db.Employer,
                            as: 'employer',
                            attributes: ['name', 'phone', 'email']
                        }]
                    }
                ]
            });

            if (!vacancy) {
                return res.status(404).json({ message: 'Вакансия не найдена' });
            }

            const employerInfo = vacancy.vacancyOwners?.[0]?.employer;

            return res.json({
                id: vacancy.vacancyId,
                position: vacancy.position?.position || 'Не указано',
                type: vacancy.vacancyType,
                company: vacancy.companyName,
                minSalary: vacancy.min_salary,
                maxSalary: vacancy.max_salary,
                description: vacancy.vacancyDescription,
                contactPerson: employerInfo?.name || 'Не указано',
                contactEmail: employerInfo?.email || 'Не указано',
                contactPhone: employerInfo?.phone || 'Не указано',
                createdAt: vacancy.createdAt,
                canApply: true
            });
        } else {
            return res.status(403).json({ message: 'Доступ запрещен' });
        }
    } catch (e) {
        console.error('Ошибка при получении вакансии:', e);
        res.status(500).json({ message: 'Не удалось загрузить вакансию' });
    }
});

//Удаление вакансии
router.delete('/:id', auth, async (req, res) => {
    let transaction;
    try {
        if (req.user.status !== 'employer') {
            return res.status(403).json({ message: 'Только работодатели могут удалять вакансии' });
        }

        const employer = await db.Employer.findOne({
            where: { email: req.user.email }
        });

        if (!employer) {
            return res.status(404).json({ message: 'Профиль работодателя не найден' });
        }

        transaction = await sequelize.transaction();

        const vacancy = await db.Vacancy.findOne({
            where: { vacancyId: req.params.id },
            include: [{
                model: db.EmployerVacancy,
                as: 'vacancyOwners',
                where: { employerId: employer.employerId },
                required: true
            }],
            transaction
        });

        if (!vacancy) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Вакансия не найдена или вам недоступна' });
        }

        await db.EmployerVacancy.destroy({
            where: { vacancyId: req.params.id },
            transaction
        });

        try {
            await db.NecessarySkill.destroy({
                where: { vacancyId: req.params.id },
                transaction
            });
        } catch (e) {
            console.log('No necessary skills to delete or error:', e.message);
        }

        try {
            const applications = await db.Application.findAll({
                where: { vacancyId: req.params.id },
                transaction
            });

            if (applications.length > 0) {
                const applicationIds = applications.map(app => app.applicationId);

                await db.StudentApplication.destroy({
                    where: { applicationId: applicationIds },
                    transaction
                });

                await db.Application.destroy({
                    where: { vacancyId: req.params.id },
                    transaction
                });
            }
        } catch (e) {
            console.log('Error deleting applications:', e.message);
        }

        await db.Vacancy.destroy({
            where: { vacancyId: req.params.id },
            transaction
        });

        await transaction.commit();

        res.json({ message: 'Вакансия успешно удалена' });

    } catch (e) {
        if (transaction) await transaction.rollback();

        console.error('Ошибка при удалении вакансии:', e);

        if (e.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                message: 'Не удалось удалить вакансию. Обратитесь к администратору.'
            });
        }

        res.status(500).json({ message: 'Не удалось удалить вакансию' });
    }
});

module.exports = router;
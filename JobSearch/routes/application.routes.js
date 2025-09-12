const router = require('express').Router();
const db = require('../models');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, async (req, res) => {
    try {
        console.log('Body:', req.body);
        console.log('User:', req.user);

        const { vacancyId } = req.body;
        const userId = req.user.userId;

        if (!vacancyId) {
            return res.status(400).json({ message: 'vacancyId обязателен' });
        }

        const student = await db.Student.findOne({
            where: { userId: userId }
        });

        if (!student) {
            return res.status(404).json({ message: 'Студент не найден' });
        }

        const vacancy = await db.Vacancy.findByPk(vacancyId);
        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        const existingApplication = await db.StudentApplication.findOne({
            where: {
                studentId: student.studentId
            },
            include: [{
                model: db.Application,
                as: 'application',
                where: {
                    vacancyId: parseInt(vacancyId)
                }
            }]
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'Вы уже откликались на эту вакансию' });
        }

        const application = await db.Application.create({
            vacancyId: vacancyId,
            applicationStatus: 'posted',
            createdAt: new Date()
        });

        await db.StudentApplication.create({
            applicationId: application.applicationId,
            studentId: student.studentId
        });

        res.status(201).json({
            success: true,
            applicationId: application.applicationId,
            message: 'Отклик успешно отправлен'
        });

    } catch (e) {
        console.error('Ошибка создания отклика:', e);
        res.status(500).json({
            message: 'Ошибка сервера при создании отклика',
            error: e.message
        });
    }
});

router.get('/check', auth, async (req, res) => {
    try {
        console.log('=== GET /api/applications/check ===');
        console.log('Query:', req.query);
        console.log('User:', req.user);

        const { vacancyId } = req.query;
        const userId = req.user.userId;

        if (!vacancyId) {
            return res.status(400).json({ message: 'vacancyId обязателен' });
        }

        const student = await db.Student.findOne({
            where: { userId: userId }
        });

        if (!student) {
            return res.json({ hasApplied: false });
        }

        const studentApplication = await db.StudentApplication.findOne({
            where: {
                studentId: student.studentId
            },
            include: [{
                model: db.Application,
                as: 'application',
                where: {
                    vacancyId: parseInt(vacancyId)
                }
            }]
        });

        res.json({ hasApplied: !!studentApplication });

    } catch (e) {
        console.error('Check application error:', e);
        res.status(500).json({
            message: 'Ошибка сервера при проверке отклика',
            error: e.message
        });
    }
});


router.get('/my-applications', auth, async (req, res) => {
    try {
        if (req.user.status !== 'student') {
            return res.status(403).json({ message: 'Только студенты могут просматривать заявки' });
        }

        const student = await db.Student.findOne({
            where: { email: req.user.email }
        });

        if (!student) {
            return res.status(404).json({ message: 'Профиль студента не найден' });
        }

        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        const where = { studentId: student.studentId };

        if (status) {
            where['$application.applicationStatus$'] = status;
        }

        const { count, rows: studentApplications } = await db.StudentApplication.findAndCountAll({
            where,
            include: [{
                model: db.Application,
                as: 'application',
                include: [{
                    model: db.Vacancy,
                    as: 'vacancy',
                    include: [{
                        model: db.NamePosition,
                        as: 'position',
                        attributes: ['position']
                    }],
                    attributes: [
                        'vacancyId',
                        'vacancyType',
                        'companyName',
                        'min_salary',
                        'max_salary',
                        'vacancyDescription',
                        'createdAt'
                    ]
                }],
                attributes: [
                    'applicationId',
                    'applicationStatus',
                    'createdAt'
                ]
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[{ model: db.Application, as: 'application' }, 'createdAt', 'DESC']],
            distinct: true
        });

        const applications = studentApplications.map(item => ({
            applicationId: item.application.applicationId,
            applicationStatus: item.application.applicationStatus,
            createdAt: item.application.createdAt,
            vacancyId: item.application.vacancy?.vacancyId,
            vacancy: item.application.vacancy ? {
                position: item.application.vacancy.position?.position || 'Не указано',
                type: item.application.vacancy.vacancyType,
                company: item.application.vacancy.companyName,
                minSalary: item.application.vacancy.min_salary,
                maxSalary: item.application.vacancy.max_salary,
                description: item.application.vacancy.vacancyDescription
            } : null
        }));

        res.json({
            success: true,
            applications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (e) {
        console.error('Ошибка при получении заявок студента:', e);

        res.status(500).json({
            success: false,
            message: 'Не удалось загрузить заявки',
            error: process.env.NODE_ENV === 'development' ? {
                name: e.name,
                message: e.message,
                stack: e.stack
            } : undefined
        });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        if (req.user.status !== 'student') {
            return res.status(403).json({ message: 'Только студенты могут просматривать заявки' });
        }

        const student = await db.Student.findOne({
            where: { email: req.user.email }
        });

        if (!student) {
            return res.status(404).json({ message: 'Профиль студента не найден' });
        }

        const application = await db.Application.findOne({
            where: { applicationId: req.params.id },
            include: [
                {
                    model: db.StudentApplication,
                    as: 'studentApplications',
                    where: { studentId: student.studentId },
                    required: true
                },
                {
                    model: db.Vacancy,
                    as: 'vacancy',
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
                    ],
                    attributes: [
                        'vacancyId',
                        'vacancyType',
                        'companyName',
                        'min_salary',
                        'max_salary',
                        'vacancyDescription',
                        'createdAt'
                    ]
                }
            ],
            attributes: [
                'applicationId',
                'applicationStatus',
                'createdAt'
            ]
        });

        if (!application) {
            return res.status(404).json({ message: 'Заявка не найдена' });
        }

        const employerInfo = application.vacancy?.vacancyOwners?.[0]?.employer;

        res.json({
            success: true,
            application: {
                applicationId: application.applicationId,
                applicationStatus: application.applicationStatus,
                createdAt: application.createdAt,
                student: {
                    name: student.name,
                    email: student.email,
                    phone: student.phone,
                    resumeStatus: student.resumeStatus
                },
                vacancy: application.vacancy ? {
                    position: application.vacancy.position?.position || 'Не указано',
                    type: application.vacancy.vacancyType,
                    company: application.vacancy.companyName,
                    minSalary: application.vacancy.min_salary,
                    maxSalary: application.vacancy.max_salary,
                    description: application.vacancy.vacancyDescription,
                    createdAt: application.vacancy.createdAt,
                    contactPerson: employerInfo?.name || 'Не указано',
                    contactEmail: employerInfo?.email || 'Не указано',
                    contactPhone: employerInfo?.phone || 'Не указано'
                } : null
            }
        });

    } catch (e) {
        console.error('Ошибка при получении заявки:', e);
        res.status(500).json({
            message: 'Не удалось загрузить заявку',
            error: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});

router.delete('/:id', auth, async (req, res) => {
    let transaction;
    try {
        if (req.user.status !== 'student') {
            return res.status(403).json({ message: 'Только студенты могут удалять заявки' });
        }

        const student = await db.Student.findOne({
            where: { email: req.user.email }
        });

        if (!student) {
            return res.status(404).json({ message: 'Профиль студента не найден' });
        }

        transaction = await db.sequelize.transaction();

        const studentApplication = await db.StudentApplication.findOne({
            where: {
                applicationId: req.params.id,
                studentId: student.studentId
            },
            transaction
        });

        if (!studentApplication) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Заявка не найдена или вам недоступна' });
        }

        const application = await db.Application.findOne({
            where: { applicationId: req.params.id },
            transaction
        });

        if (application.applicationStatus !== 'posted') {
            await transaction.rollback();
            return res.status(400).json({ message: 'Можно отозвать только отправленные заявки' });
        }

        await db.StudentApplication.destroy({
            where: {
                applicationId: req.params.id,
                studentId: student.studentId
            },
            transaction
        });

        const remainingConnections = await db.StudentApplication.count({
            where: { applicationId: req.params.id },
            transaction
        });

        if (remainingConnections === 0) {
            await db.Application.destroy({
                where: { applicationId: req.params.id },
                transaction
            });
        }

        await transaction.commit();

        res.json({ message: 'Заявка успешно отозвана' });

    } catch (e) {
        if (transaction) await transaction.rollback();

        console.error('Ошибка при удалении заявки:', e);
        res.status(500).json({ message: 'Не удалось отозвать заявку' });
    }
});


module.exports = router;
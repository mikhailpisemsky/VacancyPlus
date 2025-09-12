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

module.exports = router;
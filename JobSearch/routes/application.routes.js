const router = require('express').Router();
const db = require('../models');

router.post('/', async (req, res) => {
    try {
        const { vacancyId } = req.body;
        const studentId = req.user.userId;
        const vacancy = await db.Vacancy.findByPk(vacancyId);
        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        const existing = await db.StudentApplication.findOne({
            where: {
                applicationId: {
                    [db.Sequelize.Op.in]: db.Sequelize.literal(
                        `(SELECT applicationId FROM applications WHERE vacancyId = ${vacancyId})`
                    )
                },
                studentId
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Вы уже откликались на эту вакансию' });
        }

        const application = await db.Application.create({
            vacancyId,
            applicationStatus: 'posted'
        });

        await db.StudentApplication.create({
            applicationId: application.applicationId,
            studentId
        });

        res.status(201).json({
            success: true,
            applicationId: application.applicationId
        });

    } catch (e) {
        console.error('Ошибка создания отклика:', e);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.get('/check', async (req, res) => {
    try {
        const { vacancyId } = req.query;
        const email = req.user.email;
        const student = await db.Student.findOne({ where: { email } })
        const studentId = student.studentId

        const application = await db.StudentApplication.findOne({
            where: { studentId },
            include: {
                model: db.Application,
                where: { vacancyId }
            }
        });

        res.json({ hasApplied: !!application });
    } catch (e) {
        console.error('Check application error:', e);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;
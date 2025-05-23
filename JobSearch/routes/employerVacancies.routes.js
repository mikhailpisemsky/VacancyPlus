const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const db = require('../models');
const router = Router();

router.get('/my-vacancies', auth, async (req, res) => {
    try {
        if(req.user.status !== 'employer') {
            return res.status(403).json({ message: 'Только работодатели могут просматривать вакансии' });
        }
        const data = await db.Employer.findOne({ where: { email: req.user.email } });

        // Параметры пагинации
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        // Условия фильтрации
        const where = { employerId: data.employerId };
        if (status) {
            where['$vacancy.vacancyStatus$'] = status;
        }

        // Запрос с пагинацией и включением связанных моделей
        const { count, rows: employerVacancies } = await db.EmployerVacancy.findAndCountAll({
            where,
            include: [{
                model: db.Vacancy,
                as: 'vacancy',
                include: [{
                    model: db.NamePosition,
                    as: 'position',
                    attributes: ['positionId', 'position']
                }],
                attributes: [
                    'vacancyId',
                    'vacancyType',
                    'companyName',
                    'min_salary',
                    'max_salary',
                    'vacancyDescription',
                    'vacancyStatus',
                    'createdAt'
                ]
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[{ model: db.Vacancy, as: 'vacancy' }, 'createdAt', 'DESC']],
            distinct: true // Важно для корректного подсчёта при пагинации
        });

        // Форматирование результата
        const vacancies = employerVacancies.map(item => ({
            id: item.vacancy.vacancyId,
            position: item.vacancy.position?.position || 'Не указано',
            type: item.vacancy.vacancyType,
            company: item.vacancy.companyName,
            minSalary: item.vacancy.min_salary,
            maxSalary: item.vacancy.max_salary,
            description: item.vacancy.vacancyDescription,
            status: item.vacancy.vacancyStatus,
            createdAt: item.vacancy.createdAt
        }));

        // Отправка ответа
        res.json({
            success: true,
            vacancies,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (e) {
        console.error('Ошибка при получении вакансий работодателя:', e);

        // Определение типа ошибки
        let statusCode = 500;
        let errorMessage = 'Не удалось загрузить вакансии';

        if (e.name === 'SequelizeDatabaseError') {
            statusCode = 400;
            errorMessage = 'Ошибка в запросе к базе данных';
        } else if (e.name === 'SequelizeValidationError') {
            statusCode = 400;
            errorMessage = 'Ошибка валидации данных';
        }

        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? {
                name: e.name,
                message: e.message,
                stack: e.stack
            } : undefined
        });
    }
});

module.exports = router;
const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const db = require('../models');
const EmployerVacancy = db.EmployerVacancy;
const Vacancy = db.Vacancy;
const NamePosition = db.NamePosition;

const router = Router();

// Получение всех вакансий текущего пользователя
router.get('/my-vacancies', auth, async (req, res) => {
    try {
        const employerId = req.user.id; // ID из токена (уже проверен)

        // Получаем вакансии с детальной информацией
        const vacancies = await EmployerVacancy.findAll({
            where: { employerId },
            include: [
                {
                    model: Vacancy,
                    as: 'vacancy',
                    include: [
                        {
                            model: NamePosition,
                            as: 'position',
                            attributes: ['positionId', 'position']
                        }
                    ],
                    attributes: [
                        'vacancyId',
                        'vacancyType',
                        'vacancyStatus',
                        'vacancyDescription',
                        'createdAt'
                    ]
                }
            ],
            order: [[{ model: Vacancy, as: 'vacancy' }, 'createdAt', 'DESC']]
        });

        // Форматируем ответ
        const result = vacancies.map(item => ({
            id: item.vacancy.vacancyId,
            position: item.vacancy.position.position,
            type: item.vacancy.vacancyType,
            status: item.vacancy.vacancyStatus,
            description: item.vacancy.vacancyDescription,
            created_at: item.vacancy.createdAt
        }));

        res.json(result);

    } catch (e) {
        console.error('Ошибка при получении вакансий:', e);
        res.status(500).json({
            message: 'Не удалось загрузить вакансии',
            error: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});

module.exports = router;
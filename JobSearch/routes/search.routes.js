const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const db = require('../models');
const router = Router();

router.get('/', async (req, res) => {
    try {
        const vacancies = await db.Vacancy.findAll({
            where: { vacancyStatus: 'created' },
            include: [{
                model: db.NamePosition,
                as: 'position',
                attributes: ['position']
            }],
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        res.json(vacancies.map(v => ({
            id: v.vacancyId,
            position: v.position?.position,
            company: v.companyName,
            createdAt: v.createdAt
        })));
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
});

module.exports = router;
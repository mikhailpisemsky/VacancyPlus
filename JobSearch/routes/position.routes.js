const { Router } = require('express');
const Position = require('../models/Position')
const auth = require('../middleware/auth.middleware');

const router = Router();

router.post('/add', async (req, res) => {
    try {
        const { position } = req.body

        const item = await Position.findOne({
            where: { position: position }
        });

        if (item) {
            return res.status(201).json({ message: 'Такая позиция уже добавлена' });
        }

        Position.create(position)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
})

module.exports = router;
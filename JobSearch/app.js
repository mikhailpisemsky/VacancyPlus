require('./models/index');
const express = require('express');
const config = require('config');
const pool = require('./config/db');

const app = express();

const PORT = config.get('port') || 5000

const cors = require('cors');
app.use(express.json({ extended: true }))

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
const settingStudent = require('./routes/settingStudent.routes')
app.use('/api/student', settingStudent);
const settingEmployer = require('./routes/settingEmployer.routes')
app.use('/api/employer', settingEmployer);
const vacanciRoutes = require('./routes/vacancy.routes')
app.use('/api/vacancies', vacanciRoutes)
const empVacanciRoutes = require('./routes/employerVacancies.routes')
app.use('/api/empvacancies', empVacanciRoutes)
const searchRoutes = require('./routes/search.routes');
app.use('/api/search', searchRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: "API работает!" });
});

const db = require('./models/index');

const start = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Подключение к БД успешно');

        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка запуска:', error);
    }
};

start();
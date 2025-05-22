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

app.get('/api/test', (req, res) => {
    res.json({ message: "API работает!" });
});

const db = require('./models/index');

async function start() { 
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Используйте { alter: true } только для разработки!
        await db.sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

start()
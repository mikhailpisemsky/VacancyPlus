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

app.get('/api/test', (req, res) => {
    res.json({ message: "API работает!" });
});

async function start() { 
    try {
        pool.query('SELECT NOW()')
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порте ${PORT}...`)
        })
    } catch (e) {
        console.log('Ошибка сервера', e.message)
        process.exit(1)
    }
}

start()
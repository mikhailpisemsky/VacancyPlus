require('./models/index');
const express = require('express');
const config = require('config');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 5000

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JobSearch API',
            version: '1.0.0',
            description: 'Документация API для системы поиска работы'
        },
        servers: [{ url: `http://localhost:${PORT}` }]
    },
    apis: [
        './routes/*.js',
        './models/*.js'
    ]
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

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
const applicationRoutes = require('./routes/application.routes');
app.use('/api/applications', applicationRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: "API работает!" });
});

const db = require('./models/index');

const start = async () => {
    try {
        await require('./models/index').sequelize.authenticate();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
    }
};

start();
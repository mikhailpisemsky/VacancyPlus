require('./models/index');
const express = require('express');
const config = require('config');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 5000

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API спецификация',
        version: '1.0.0',
        description: 'API спецификация сервиса для поиска временной работы или стажировок.'
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    tags: [
        { name: 'Auth', description: 'Аутентификация и авторизация' },
        { name: 'Vacancies', description: 'Вакансии и стажировки' },
        { name: 'Applications', description: 'Заявки и отклики' }
    ],
    paths: {
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Авторизация пользователя',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'student_1@test.ru', format: 'isEmail' },
                                    password: { type: 'string', example: '123456', format: 'Длина: не менее 6' },
                                    status: { type: 'string', enum: ['student', 'employer'], description: 'Статус пользователя: студент, работодатель.' }
                                },
                                required: ['email', 'password', 'status']
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Авторизация успешна',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string', example: 'student_1@test.ru' },
                                        password: { type: 'string', example: '123456' },
                                        status: { type: 'string', example: 'student' }
                                    }
                                }
                            }
                        }
                    },
                    'default': {
                        description: 'Неправильные данные при авторизации',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', enum: ['Пользователь не найден', 'Неверный пароль', 'Неверный тип аккаунта'] }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Регистрация нового пользователя.'
            }
        },
        '/vacancies': {
            get: {
                tags: ['Vacancies'],
                summary: 'Получить список вакансий',
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        description: 'Номер страницы',
                        schema: { type: 'integer', default: 1 }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        description: 'Количество элементов на странице',
                        schema: { type: 'integer', default: 10 }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Список вакансий',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        vacancies: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    title: { type: 'string' },
                                                    description: { type: 'string' },
                                                    department: { type: 'string' }
                                                }
                                            }
                                        },
                                        total: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' },
                    role: { type: 'string', enum: ['student', 'employer', 'admin'] }
                }
            },
            Vacancy: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    department: { type: 'string' },
                    requirements: { type: 'string' },
                    is_active: { type: 'boolean' }
                }
            }
        },
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const cors = require('cors');
app.use(express.json({ extended: true }))

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
const settingStudent = require('./routes/setting.routes')
app.use('/api/information', settingStudent);
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
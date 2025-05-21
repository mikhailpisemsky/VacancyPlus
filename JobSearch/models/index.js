const sequelize = require('../config/db');

const setupAssociations = () => {
    const {
        User,
        Student,
        Employer,
        Position,
        Vacancy,
        Skill,
        StudentSkill,
        RequiredSkill,
        Application,
        StudentApplication,
        EmployerVacancy,
        Resume
    } = sequelize.models;

    // Проверка наличия всех моделей перед установкой связей
    if (!User || !Student || !Employer || !Position || !Vacancy ||
        !Skill || !StudentSkill || !RequiredSkill || !Application ||
        !StudentApplication || !EmployerVacancy || !Resume) {
        throw new Error('Не все модели были правильно инициализированы');
    }

    try {
        // 1. Связи пользователей (User)
        User.belongsTo(Student, {
            foreignKey: 'email',
            targetKey: 'email',
            as: 'studentData',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.belongsTo(Employer, {
            foreignKey: 'email',
            targetKey: 'email',
            as: 'employerData',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // 2. Связи студентов (Student)
        Student.hasOne(Resume, {
            foreignKey: 'studentId',
            as: 'resume',
            onDelete: 'CASCADE'
        });

        Student.hasMany(StudentSkill, {
            foreignKey: 'studentId',
            as: 'skills',
            onDelete: 'CASCADE'
        });

        Student.hasMany(StudentApplication, {
            foreignKey: 'studentId',
            as: 'applications',
            onDelete: 'CASCADE'
        });

        // 3. Связи работодателей (Employer)
        Employer.hasMany(EmployerVacancy, {
            foreignKey: 'employerId',
            as: 'postedVacancies',
            onDelete: 'CASCADE'
        });

        // 4. Связи вакансий (Vacancy)
        Vacancy.belongsTo(Position, {
            foreignKey: 'positionId',
            as: 'position',
            onDelete: 'RESTRICT' // Не удаляем позицию при удалении вакансии
        });

        Vacancy.hasMany(RequiredSkill, {
            foreignKey: 'vacancyId',
            as: 'requiredSkills',
            onDelete: 'CASCADE'
        });

        Vacancy.hasMany(EmployerVacancy, {
            foreignKey: 'vacancyId',
            as: 'vacancyOwners',
            onDelete: 'CASCADE'
        });

        Vacancy.hasMany(Application, {
            foreignKey: 'vacancyId',
            as: 'jobApplications',
            onDelete: 'CASCADE'
        });

        // 5. Связи навыков (Skill)
        Skill.hasMany(StudentSkill, {
            foreignKey: 'skillId',
            as: 'studentAssociations',
            onDelete: 'CASCADE'
        });

        Skill.hasMany(RequiredSkill, {
            foreignKey: 'skillId',
            as: 'vacancyRequirements',
            onDelete: 'CASCADE'
        });

        // 6. Связи заявок (Application)
        Application.belongsTo(Student, {
            through: StudentApplication,
            foreignKey: 'applicationId',
            as: 'applicant',
            onDelete: 'CASCADE'
        });

        console.log('Все ассоциации успешно установлены');
    } catch (error) {
        console.error('Ошибка при установке ассоциаций:', error);
        throw error;
    }
};

// Проверяем подключение перед установкой ассоциаций
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД успешно установлено');

        // Синхронизация моделей (опционально)
        await sequelize.sync({ alter: true }); // Используйте { force: true } только для разработки!
        console.log('Модели синхронизированы');

        // Устанавливаем ассоциации
        setupAssociations();
    } catch (error) {
        console.error('Ошибка инициализации БД:', error);
        process.exit(1); // Завершаем процесс с ошибкой
    }
}

initializeDatabase();

module.exports = setupAssociations;
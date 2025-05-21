const sequelize = require('../config/db'); // Импортируем настроенный пул из db.js

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

    // Связи пользователей
    User.belongsTo(Student, { foreignKey: 'email', targetKey: 'email' });
    User.belongsTo(Employer, { foreignKey: 'email', targetKey: 'email' });

    // Связи студентов
    Student.hasOne(Resume, { foreignKey: 'studentId' });
    Student.hasMany(StudentSkill, { foreignKey: 'studentId' });
    Student.hasMany(StudentApplication, { foreignKey: 'studentId' });

    // Связи работодателей
    Employer.hasMany(EmployerVacancy, { foreignKey: 'employerId' });

    // Связи вакансий
    Vacancy.belongsTo(Position, { foreignKey: 'positionId' });
    Vacancy.hasMany(RequiredSkill, { foreignKey: 'vacancyId' });
    Vacancy.hasMany(EmployerVacancy, { foreignKey: 'vacancyId' });
    Vacancy.hasMany(Application, { foreignKey: 'vacancyId' });

    // Связи навыков
    Skill.hasMany(StudentSkill, { foreignKey: 'skillId' });
    Skill.hasMany(RequiredSkill, { foreignKey: 'skillId' });

    // Связи заявок
    Application.hasOne(StudentApplication, { foreignKey: 'applicationId' });
};

setupAssociations();
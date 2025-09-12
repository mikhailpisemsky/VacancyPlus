module.exports = (sequelize, DataTypes) => {
    const EmployerVacancy = sequelize.define('EmployerVacancy', {
        vacancyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'vacancies',
                key: 'vacancyId'
            },
            onDelete: 'CASCADE'
        },

        employerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'employers',
                key: 'employerId'
            },
            onDelete: 'CASCADE'
        },
    },
        {
            tableName: 'employers_vacancies',
            timestamps: false,
        });

    EmployerVacancy.associate = (models) => {
        EmployerVacancy.belongsTo(models.Vacancy, {
            foreignKey: 'vacancyId',
            as: 'vacancy'
        });
        EmployerVacancy.belongsTo(models.Employer, {
            foreignKey: 'employerId',
            as: 'employer'
        });
    };

    return EmployerVacancy;
};
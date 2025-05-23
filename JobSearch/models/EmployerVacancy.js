module.exports = (sequelize, DataTypes) => {
    const EmployerVacancy = sequelize.define('EmployerVacancy', {
        vacancyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },

        employerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
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
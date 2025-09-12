module.exports = (sequelize, DataTypes) => {
    const Vacancy = sequelize.define('Vacancy', {
        vacancyId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        vacancyType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [
                    [
                        'полная занятость',
                        'частичная занятость',
                        'удалённая работа',
                        'ассистент преподавателя',
                        'помощь в административных отделах',
                        'участие в исследовательских проектах',
                        'стажировка в партнёрских организациях'
                    ]
                ]
            }
        },

        positionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'positions',
                key: 'positionId'
            },
            onDelete: 'CASCADE'
        },

        companyName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        min_salary: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        max_salary: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        vacancyDescription: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        vacancyStatus: {
            type: DataTypes.STRING,
            defaultValue: 'created',
            validate: {
                isIn: [['created', 'posted', 'closed']]
            }
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
    },
        {
            tableName: 'vacancies',
            timestamps: true,
        });

    Vacancy.associate = (models) => {
        Vacancy.belongsTo(models.NamePosition, {
            foreignKey: 'positionId',
            as: 'position',
            onDelete: 'RESTRICT'
        });

        Vacancy.hasMany(models.NecessarySkill, {
            foreignKey: 'vacancyId',
            as: 'requiredSkills',
            onDelete: 'CASCADE'
        });

        Vacancy.belongsToMany(models.Employer, {
            through: models.EmployerVacancy,
            foreignKey: 'vacancyId',
            as: 'employers'
        });

        Vacancy.hasMany(models.EmployerVacancy, {
            foreignKey: 'vacancyId',
            as: 'vacancyOwners',
            onDelete: 'CASCADE'
        });

        Vacancy.hasMany(models.Application, {
            foreignKey: 'vacancyId',
            as: 'jobApplications',
            onDelete: 'CASCADE'
        });
    };

    return Vacancy;
};

module.exports = (sequelize, DataTypes) => {
    const Employer = sequelize.define('Employer', {

        userId: { 
            type: DataTypes.INTEGER,
            unique: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },

        employerId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },

        name: {
            type: DataTypes.STRING,
            allowNull: true
        },

        phone: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                is: /^(|[\+\d\s\-\(\)]{5,20})$/i
            }
        },
    },
        {
            tableName: 'employers',
            timestamps: false,
        });

    Employer.associate = (models) => {
        Employer.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        Employer.belongsToMany(models.Vacancy, {
            through: models.EmployerVacancy,
            foreignKey: 'employerId',
            otherKey: 'vacancyId',
            as: 'vacancies'
        });
    };

    return Employer;
};
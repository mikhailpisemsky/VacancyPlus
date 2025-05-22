module.exports = (sequelize, DataTypes) => {
    const Employer = sequelize.define('Employer', {
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
        },

        phone: {
            type: DataTypes.STRING(20),
            validate: {
                is: /^[\+\d\s\-\(\)]{5,20}$/i
            }
        },
    },
        {
            tableName: 'employers',
            timestamps: false,
        });

    Employer.associate = (models) => {
        Employer.hasMany(models.EmployerVacancy, {
            foreignKey: 'employerId',
            as: 'postedVacancies',
            onDelete: 'CASCADE'
        });
    }

    return Employer;
};
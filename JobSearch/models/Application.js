module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
        applicationId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        vacancyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        applicationStatus: {
            type: DataTypes.STRING,
            defaultValue: 'posted',
            validate: {
                isIn: [['posted', 'accepted', 'rejected']]
            }
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
    },
        {
            tableName: 'applications',
            timestamps: true,
        });

    Application.associate = (models) => {
        Application.belongsTo(models.Vacancy, {
            foreignKey: 'vacancyId',
            as: 'vacancy'
        });

        Application.belongsToMany(models.Student, {
            through: models.StudentApplication,
            foreignKey: 'applicationId',
            as: 'applicants'
        });
    };

    return Application;
};
module.exports = (sequelize, DataTypes) => {
    const NamePosition = sequelize.define('NamePosition', {
        positionId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        position: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
        {
            tableName: 'positions',
            timestamps: false,
        });

    NamePosition.associate = (models) => {
        NamePosition.hasMany(models.Vacancy, {
            foreignKey: 'positionId',
            as: 'vacancies'
        });
    };

    return NamePosition;
}
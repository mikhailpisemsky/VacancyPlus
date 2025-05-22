module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [6] }
        },

        status: {
            type: DataTypes.STRING,
            defaultValue: 'student',
            validate: {
                isIn: [['student', 'employer']]
            }
        }
    },

        {
            tableName: 'users',
            timestamps: false,
        });

    User.associate = (models) => {
        User.hasOne(models.Student, {
            foreignKey: 'userId',
            as: 'student',
            onDelete: 'CASCADE',
        });

        User.hasOne(models.Employer, {
            foreignKey: 'userId',
            as: 'employer',
            onDelete: 'CASCADE',
        });
    };

    return User;
};
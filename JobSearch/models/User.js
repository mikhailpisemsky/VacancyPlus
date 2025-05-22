module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
            primaryKey: true,
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
            foreignKey: 'email',
            sourceKey: 'email',
            as: 'student',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.hasOne(models.Employer, {
            foreignKey: 'email',
            sourceKey: 'email',
            as: 'employer',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return User;
};
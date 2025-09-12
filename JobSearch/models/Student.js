module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        userId: {
            type: DataTypes.INTEGER,
            unique: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },

        studentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
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

        resumeStatus: {
            type: DataTypes.STRING(255),
            defaultValue: 'resume not uploaded',
            validate: {
                isIn: [['resume not uploaded', 'resume uploaded']]
            }
        }
    },
        {
            tableName: 'students',
            timestamps: false,
        });

    Student.associate = (models) => {
        Student.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        Student.hasOne(models.Resume, {
            foreignKey: 'studentId',
            as: 'resume'
        });
        Student.belongsToMany(models.Application, {
            through: models.StudentApplication,
            foreignKey: 'studentId',
            otherKey: 'applicationId',
            as: 'applications'
        });
    };

    return Student;
};
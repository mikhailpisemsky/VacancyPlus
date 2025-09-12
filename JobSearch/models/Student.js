module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        userId: {
            type: DataTypes.INTEGER,
            unique: true,
            references: {
                model: 'users',
                key: 'id'
            }
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
        Student.hasOne(models.Resume, {
            foreignKey: 'studentId',
            as: 'resume',
            onDelete: 'CASCADE'
        });

        Student.hasMany(models.StudentSkill, {
            foreignKey: 'studentId',
            as: 'skills',
            onDelete: 'CASCADE'
        });

        Student.hasMany(models.StudentApplication, {
            foreignKey: 'studentId',
            as: 'applications',
            onDelete: 'CASCADE'
        });
    };

    return Student;
};
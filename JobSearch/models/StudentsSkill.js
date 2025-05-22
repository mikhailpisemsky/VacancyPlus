module.exports = (sequelize, DataTypes) => {
    const StudentSkill = sequelize.define('StudentSkill', {
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
            tableName: 'students_skills',
            timestamps: false,
        });

    return StudentSkill;
};
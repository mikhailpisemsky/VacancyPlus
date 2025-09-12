module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define('Skill', {
        skillId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        skill: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
        {
            tableName: 'skills',
            timestamps: false
        });

    Skill.associate = (models) => {
        Skill.belongsToMany(models.Vacancy, {
            through: models.NecessarySkill,
            foreignKey: 'skillId',
            otherKey: 'vacancyId',
            as: 'vacancies'
        });
        Skill.belongsToMany(models.Student, {
            through: models.StudentSkill,
            foreignKey: 'skillId',
            otherKey: 'studentId',
            as: 'students'
        });
    };


    return Skill;
};

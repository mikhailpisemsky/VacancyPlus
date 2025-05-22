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
            timestamps: false,
            createdAt: false,
        });

    Skill.associate = (models) => {
        Skill.hasMany(models.StudentSkill, {
            foreignKey: 'skillId',
            as: 'studentAssociations',
            onDelete: 'CASCADE'
        });

        Skill.hasMany(models.NecessarySkill, {
            foreignKey: 'skillId',
            as: 'vacancyRequirements',
            onDelete: 'CASCADE'
        });
    };

    return Skill;
};

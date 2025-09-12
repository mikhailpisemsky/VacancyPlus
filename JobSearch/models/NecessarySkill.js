module.exports = (sequelize, DataTypes) => {
    const NecessarySkill = sequelize.define('NecessarySkill', {
        vacancyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'vacancies',
                key: 'vacancyId'
            },
            onDelete: 'CASCADE'
        },
        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'skills',
                key: 'skillId'
            },
            onDelete: 'CASCADE'
        },
    }, {
        tableName: 'necessary_skills',
        timestamps: false
    });

    NecessarySkill.associate = (models) => {
        NecessarySkill.belongsTo(models.Vacancy, {
            foreignKey: 'vacancyId',
            as: 'vacancy'
        });

        NecessarySkill.belongsTo(models.Skill, {
            foreignKey: 'skillId',
            as: 'skill'
        });
    };

    return NecessarySkill;
};
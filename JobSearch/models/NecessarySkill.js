module.exports = (sequelize, DataTypes) => {
    const NecessarySkill = sequelize.define('NecessarySkill', {
        vacancyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
        {
            tableName: 'necessary_skills',
            timestamps: false
        });

    return NecessarySkill;
};
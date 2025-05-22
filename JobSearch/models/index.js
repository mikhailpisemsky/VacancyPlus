const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = require('../config/db');

// 1. Сначала загружаем все модели без ассоциаций
fs.readdirSync(__dirname)
    .filter(file => (
        file !== basename &&
        file.endsWith('.js') &&
        !file.includes('.test.js')
    ))
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// 2. Затем устанавливаем ассоциации
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
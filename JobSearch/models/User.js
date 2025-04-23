const { Schema, model } = require('pg')

const schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true }
})

module.exports = model('User', schema)
const mongoose = require('mongoose')

const UsuarioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true},
    phone: { type: String, required: true },
}, {timestamps: true});

module.exports = mongoose.model ('Usuario', UsuarioSchema);

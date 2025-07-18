const mongoose = require ('mongoose');
const Usuario = require('./User');
const { object } = require('webidl-conversions');

const PetSchema = new mongoose.Schema({

    name: {type: String, required: true},
    weight: {type: Number, required: true},
    color: {type: String, required: true},
    available: {type: Boolean, required: true},
    user: {type: Object},
    adopter : {type: Object}
}, {timestamps: true});

module.exports = mongoose.model('Pet', PetSchema);
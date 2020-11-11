// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassLink = new Schema({
    aulaLink: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("classLink", ClassLink);
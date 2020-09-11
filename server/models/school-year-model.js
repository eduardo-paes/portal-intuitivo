// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Disciplina = require("./subject-model.js");

const AnoLetivo = new Schema({
    dataInicio: {
        type: Date, 
        required: true
    },
    dataFim: {
        type: Date, 
        required: true
    },
    contagem: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("anoLetivo", AnoLetivo);
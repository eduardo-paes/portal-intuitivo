// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Disciplina = require("./subject-model.js");

const AnoLetivo = new Schema({
    anoInicio: {
        type: Date, 
        required: true
    },
    anoFim: {
        type: Date, 
        required: true
    }
});

module.exports = mongoose.model("anoLetivo", AnoLetivo);
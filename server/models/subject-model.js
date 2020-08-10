// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Disciplina = new Schema({
    nome: {
        type: String,
        required: true
    },
    diaSemana: {
        type: Number,
        required: true
    },
    areaConhecimento: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("disciplina", Disciplina);
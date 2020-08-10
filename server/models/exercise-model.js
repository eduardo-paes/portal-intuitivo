// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Disciplina = require("./subject-model.js");

const Atividade = new Schema({
    nome: {
        type: String,
        required: true
    },
    diaSemana: {
        type: Number,
        required: true
    }, 
    disciplina: {
        type: Schema.Types.ObjectId, 
        ref: 'Disciplina'
    }
});

module.exports = mongoose.model("atividade", Atividade);
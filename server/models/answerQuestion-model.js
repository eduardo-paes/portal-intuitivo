// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Usuario = require("./users-model");
const Questao = require("./question-model");
const Schema = mongoose.Schema;

const RespostaQuestao = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    alunoID: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    questaoID: {
        type: Schema.Types.ObjectId,
        ref: 'Questao',
        required: true,
    },
    resposta: {
        type: String,
        required: true
    },
    nota: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("respostaquestao", RespostaQuestao);
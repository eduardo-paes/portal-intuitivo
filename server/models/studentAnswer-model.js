// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Usuario = require("./users-model")
const Atividade = require("./activity-model")
const Revisao = require("./revision-model")
const Questao = require("./question-model")
const Schema = mongoose.Schema;

const RespostaAluno = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    alunoID: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    atividadeID: {
        type: Schema.Types.ObjectId,
        ref: 'Atividade',
    },
    revisaoID: {
        type: Schema.Types.ObjectId,
        ref: 'Revisao',
    },
    questaoID: [{
        type: Schema.Types.ObjectId,
        ref: 'Questao',
        required: true,
    }]
});

module.exports = mongoose.model("respostaaluno", RespostaAluno);
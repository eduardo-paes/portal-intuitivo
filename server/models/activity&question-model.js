// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Questao = require("./question-model.js");
const Atividade = require("./activity-model.js");

const AtividadeQuestao = new Schema({
    questaoID: {
        type: Schema.Types.ObjectId,
        ref: 'Questao',
        required: true
    },
    atividadeID: {
        type: Schema.Types.ObjectId,
        ref: 'Atividade',
        required: true
    }
});

module.exports = mongoose.model("atividadeQuestoe", AtividadeQuestao);
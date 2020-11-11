// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AtividadeQuestao = new Schema({
    questaoID: {
        type: Schema.Types.ObjectId,
        ref: 'questoe',
        required: true
    },
    atividadeID: {
        type: Schema.Types.ObjectId,
        ref: 'atividade',
        required: true
    }
});

module.exports = mongoose.model("atividadeQuestoe", AtividadeQuestao);
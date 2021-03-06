// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RespostaQuestao = new Schema({
    alunoID: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    atividadeID: {
        type: Schema.Types.ObjectId,
        ref: 'atividade'
    },
    revisaoID: {
        type: Schema.Types.ObjectId,
        ref: 'revisoe'
    },
    questaoID: {
        type: Schema.Types.ObjectId,
        ref: 'questoe',
        required: true,
    },
    resposta: {
        type: String,
    },
    corrigido: {
        type: Boolean,
    },
    nota: {
        type: Number,
    },
    comentario: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("respostaQuestoe", RespostaQuestao);
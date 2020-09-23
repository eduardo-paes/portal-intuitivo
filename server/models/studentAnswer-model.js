// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RespostaAluno = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    alunoID: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    atividadeID: {
        type: Schema.Types.ObjectId,
        ref: 'atividade',
    },
    revisaoID: {
        type: Schema.Types.ObjectId,
        ref: 'revisoe',
    },
    respostaQuestaoID: [{
        type: Schema.Types.ObjectId,
        ref: 'questoe',
        required: true,
    }]
});

module.exports = mongoose.model("respostaaluno", RespostaAluno);
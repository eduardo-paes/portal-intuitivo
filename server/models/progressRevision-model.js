// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressoRevisao = new Schema({
    revisaoID: {
        type: Schema.Types.ObjectId, 
        ref: 'revisoe',
        required: true
    },
    alunoID: {
        type: Schema.Types.ObjectId, 
        ref: 'usuario',
        required: true
    },
    progresso: {
        type: Boolean,
        required: false
    },
    dataConclusao: {
        type: Date,
        default: Date.now, 
    }
});

module.exports = mongoose.model("progressoRevisao", ProgressoRevisao);
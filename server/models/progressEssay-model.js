// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressoRedacao = new Schema({
    redacaoID: {
        type: Schema.Types.ObjectId, 
        ref: 'atividade',
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
    },
    corrigido: {
        type: Boolean,
        required: false
    }
});

module.exports = mongoose.model("progressoRedacao", ProgressoRedacao);
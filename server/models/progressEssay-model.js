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
    },
    nota: {
        type: Number,
        required: false
    },
    eixo1: {
        a1: { type: Number },
        a2: { type: Number },
        a3: { type: Number },
        a4: { type: Number },
        a5: { type: Number },
        a6: { type: Number },
        a7: { type: Number },
        a8: { type: Number },
        a9: { type: Number },
    },
    eixo2: {
        b1: { type: Number },
        b2: { type: Number },
        b3: { type: Number },
        b4: { type: Number },
        b5: { type: Number },
        b6: { type: Number },
        b7: { type: Number },
        b8: { type: Number },
        b9: { type: Number },
        b10: { type: Number },
        b11: { type: Number },
        b12: { type: Number },
    },
    eixo3: {
        c1: { type: Number },
        c2: { type: Number },
        c3: { type: Number },
        c4: { type: Number },
        c5: { type: Number },
        c6: { type: Number },
        c7: { type: Number },
        c8: { type: Number },
    },
});

module.exports = mongoose.model("progressoRedacao", ProgressoRedacao);
// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressoTopico = new Schema({
    topicoID: {
        type: Schema.Types.ObjectId, 
        ref: 'conteudo',
        required: true
    },
    alunoID: {
        type: Schema.Types.ObjectId, 
        ref: 'usuario',
        required: true
    },
    progresso: {
        materialEstudo: {
            type: Boolean,
            required: false
        },
        videoaula: {
            type: Boolean,
            required: false
        },
        exercicioFixacao: {
            type: Boolean,
            required: false
        },
        exercicioRetomada: {
            type: Boolean,
            required: false
        },
        exercicioAprofundamento: {
            type: Boolean,
            required: false
        },
    }
});

module.exports = mongoose.model("progressoTopico", ProgressoTopico);
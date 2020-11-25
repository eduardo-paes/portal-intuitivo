// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Conteudo = new Schema({
    disciplinaID: {
        type: Schema.Types.ObjectId, 
        ref: 'disciplina',
        required: true
    },
    topico: {
        type: String,
        required: true
    },
    numeracao: {
        type: Number,
        required: true
    },
    videoAulaURL: {
        type: String,
        required: true
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    },
    conteudoURL: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("conteudo", Conteudo);
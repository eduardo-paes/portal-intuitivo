// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Usuario = require("./users-model")
const Schema = mongoose.Schema;

const Conteudo = new Schema({
    area: {
        type: String,
        // required: true
    },
    disciplinaID: {
        type: Schema.Types.ObjectId, 
        ref: 'Disciplina'
    },
    disciplinaNome: {
        type: String,
    },
    topico: {
        type: String,
        // required: true
    },
    numeracao: {
        type: Number,
        // required: true
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model("conteudo", Conteudo);
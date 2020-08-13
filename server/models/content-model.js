// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Usuario = require("./users-model")
const Schema = mongoose.Schema;

const Conteudo = new Schema({
    area: {
        type: String,
        // required: true
    },
    disciplina: {
        type: String,
        // required: true
    },
    topico: {
        type: String,
        // required: true
    },
    numeracao: {
        type: Number,
        // required: true
    },
    conteudo: {
        type: Object,
        // required: true
    },
    autor: {
        type: String,
        // type: String,
        // type: Usuario,
        // ref: "Usuario"
    }
});

module.exports = mongoose.model("conteudo", Conteudo);
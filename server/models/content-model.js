// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Usuario = require("./users-model")
const Schema = mongoose.Schema;

const Conteudo = new Schema({
    disciplina: {
        type: String,
        // required: true
    },
    topico: {
        type: String,
        // required: true
    },
    semana: {
        type: Number,
        // required: true
    },
    data: {
        type: Date,
        // required: true
    },
    conteudo: {
        type: String,
        // required: true
    },
    autor: {
        type: String,
        // type: Usuario,
        // ref: "Usuario"
    }
});

module.exports = mongoose.model("conteudo", Conteudo);
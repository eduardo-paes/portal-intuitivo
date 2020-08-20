// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Disciplina = require("./subject-model.js");
const Usuario = require("./users-model.js");

const Questao = new Schema({
    disciplina: {
        // type: Schema.Types.ObjectId, 
        // ref: 'Disciplina',
        type: String,
        // required: true
    },
    topico: {
        type: String,
        // required: true
    },
    enunciado: {
        type: String,
        // required: true
    }, 
    tipoResposta: {
        type: String,
        // required: true
    },
    resposta: [
        {
            opcao: String, 
            gabarito: Boolean,
            // required: true
        }
    ],
    gabarito: {
        type: Array,
        // required: true
    },
    dataCriacao: { 
        type: Date, 
        default: Date.now 
    },
    dataEdicao: { 
        type: Date, 
        default: Date.now 
    },
    autor: {
        type: String
        // type: Schema.Types.ObjectId, 
        // ref: 'Usuario',
        // required: true
    }
});

module.exports = mongoose.model("questao", Questao);
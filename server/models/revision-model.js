// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Questao = require("./question-model.js");
const Usuario = require("./user-model.js");

const Revisao = new Schema({
    tipoAtividade: {
        type: String,
        required: true
    },
    areaConhecimento: {
        type: String,
        required: true
    },
    numeracao: {
        type: Number,
        required: false
    },
    questoes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Questao',
            required: true
        }
    ],
    dataCriacao: { 
        type: Date, 
        default: Date.now
    },
    dataEdicao: { 
        type: Date, 
        default: Date.now
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = mongoose.model("revisoe", Revisao);
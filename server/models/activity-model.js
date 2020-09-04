// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Disciplina = require("./subject-model.js");
const Conteudo = require("./content-model.js");
const Questao = require("./question-model.js");
const Usuario = require("./users-model.js");

const Atividade = new Schema({
    tipoAtividade: {
        type: String,
        required: true
    },
    disciplina: {
        id: {
            type: Schema.Types.ObjectId, 
            ref: 'Disciplina'
        },
        nome: {
            type: String,
            required: true
        }
    },
    areaConhecimento: {
        type: String,
        required: true
    },
    topico: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Conteudo',
        },
        nome: {
            type: String,
            required: true
        }
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
    dataModificacao: { 
        type: Date, 
        default: Date.now
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = mongoose.model("atividade", Atividade);
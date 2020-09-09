// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Usuario = require("./users-model")
const Disciplina = require("./subject-model")
const Conteudo = require("./content-model")
const Tag = require("./tag-model")
const Schema = mongoose.Schema;

const Questao = new Schema({
    disciplina: {
        id: {
            type: Schema.Types.ObjectId, 
            ref: 'Disciplina',
            required: true
        },
        nome: {
            type: String,
            required: true
        }
    },
    topico: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Conteudo',
            required: true
        },
        nome: {
            type: String,
            required: true
        }
    },
    enunciado: {
        type: String,
        required: true
    }, 
    tipoResposta: {
        type: String,
        required: true
    },
    resposta: [
        {
            opcao: String, 
            gabarito: Boolean,
            required: false
        }
    ],
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
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

module.exports = mongoose.model("questoe", Questao);
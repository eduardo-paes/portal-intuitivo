// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Questao = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    disciplinaID: {
        type: Schema.Types.ObjectId, 
        ref: 'disciplina',
        required: true
    },
    topicoID: {
        type: Schema.Types.ObjectId,
        ref: 'conteudo',
        required: true
    },
    enunciado: {
        type: String,
        required: true
    }, 
    tipoResposta: {
        type: String,
        required: true
    },
    padraoResposta: {
        type: String,
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
            ref: 'tagQuestoe',
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
        ref: 'usuario',
        required: true
    }
});

module.exports = mongoose.model("questoe", Questao);
// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Atividade = new Schema({
    tipoAtividade: {
        type: String,
        required: true
    },
    disciplinaID: {
        type: Schema.Types.ObjectId, 
        ref: 'disciplina'
    },
    areaConhecimento: {
        type: String,
        required: true
    },
    topicoID: {
        type: Schema.Types.ObjectId,
        ref: 'conteudo',
    },
    questoes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'questoe',
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
        ref: 'usuario',
        required: true
    }
});

module.exports = mongoose.model("atividade", Atividade);
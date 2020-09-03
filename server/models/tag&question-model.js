// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Questao = require("./question-model.js");
const Tag = require("./tag-model.js");

const TagQuestao = new Schema({
    tagID: {
        type: Schema.Types.ObjectId, 
        ref: 'Tag'
    },
    questaoID: {
        type: Schema.Types.ObjectId, 
        ref: 'Questao'
    }
});

module.exports = mongoose.model("tagQuestoe", TagQuestao);
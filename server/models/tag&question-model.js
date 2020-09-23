// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagQuestao = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    tagID: {
        type: Schema.Types.ObjectId, 
        ref: 'tag'
    },
    questaoID: {
        type: Schema.Types.ObjectId, 
        ref: 'questoe'
    }
});

module.exports = mongoose.model("tagQuestoe", TagQuestao);
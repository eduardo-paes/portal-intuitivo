// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tag = new Schema({
    nome: {
        type: String,
        required: true
    },
    disciplinaID: {
        type: Schema.Types.ObjectId, 
        ref: 'disciplina'
    }
});

module.exports = mongoose.model("tag", Tag);
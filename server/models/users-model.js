// Define o Schema e o Modelo para os objetos do banco de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    acesso: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    disciplina: [
        {
            disciplinaID: {
                type: Schema.Types.ObjectId, 
                ref: 'disciplina'
            }
        }
    ],
});

module.exports = mongoose.model("usuario", Usuario);
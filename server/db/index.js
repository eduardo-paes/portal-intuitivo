require('dotenv').config();
// Realiza a conexão do servidor com o banco de dados
const mongoose = require('mongoose');

// Local
// mongoose.connect("mongodb://localhost:27017/IntuitivoDB", {useUnifiedTopology: true, useNewUrlParser: true});

// Servidor
mongoose.connect(process.env.BD_URL, {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    connectTimeoutMS: 720000,
    socketTimeoutMS: 720000
});

const db = mongoose.connection;

module.exports = db;
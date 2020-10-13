const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Importação das rotas pré-estabelecidas em routes.js
const Routes = require('./routes/routes')

// Conexão com o banco
const db = require("./db");
db.on("error", console.error.bind(console, "Erro de conexão com MongoDB: "));

// -- APP
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// Permite carregar os arquivos que estão no diretório uploads a partir do prefixo do caminho /uploads.
app.use('/uploads', express.static(__dirname + './../uploads'));

// Rota inicial - teste
app.get("/", (req, res) => {
    res.send("Hello World!")
});

// Rotas principais importadas de Routes
app.use("/api", Routes);

app.listen(5000, function(){
    console.log("Server started on port 5000.");
});
  
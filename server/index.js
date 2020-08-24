const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./db");
const Routes = require('./routes/routes')

// -- APP
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// Conexão com o banco
db.on("error", console.error.bind(console, "Erro de conexão com MongoDB: "));

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.use("/api", Routes);

app.listen(5000, function(){
    console.log("Server started on port 5000.");
});
  
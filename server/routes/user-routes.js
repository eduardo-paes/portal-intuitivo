// Define as rotas que serão utilizadas para lidar com o banco de dados
const express = require("express");

const UsuarioCtrl = require("../controllers/user-ctrl");

const router = express.Router();

// Definição dos métodos para cada rota
router.post("/controle-usuario", UsuarioCtrl.inserirUsuario);
router.put("/controle-usuario/:id", UsuarioCtrl.atualizarUsuario);
router.delete("/controle-usuario/:id", UsuarioCtrl.removerUsuario);
router.get("/controle-usuario/:id", UsuarioCtrl.encUsuarioPorID);
router.get("/controle-usuario", UsuarioCtrl.listarUsuarios);

module.exports = router;
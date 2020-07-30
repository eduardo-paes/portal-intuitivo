// Define as rotas que serão utilizadas para lidar com o banco de dados
const express = require("express");

const UsuarioCtrl = require("../controllers/user-ctrl");

const router = express.Router();

// Traz o multer, middleware que processará a imagem de perfil do usuário
const multer = require("multer");
const multerConfig = require("./config/multer");

// Definição dos métodos para cada rota
router.post("/controle-usuario", multer(multerConfig).single("foto"), UsuarioCtrl.inserirUsuario);
router.put("/controle-usuario/:id", multer(multerConfig).single("foto"), UsuarioCtrl.atualizarUsuario);
router.delete("/controle-usuario/:id", UsuarioCtrl.removerUsuario);
router.get("/controle-usuario/:id", UsuarioCtrl.encUsuarioPorID);
router.get("/controle-usuario", UsuarioCtrl.listarUsuarios);

module.exports = router;
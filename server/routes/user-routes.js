// Define as rotas que serão utilizadas para lidar com o banco de dados
const express = require("express");
const router = express.Router();

// Importação dos métodos de controle
const UsuarioCtrl = require("../controllers/user-ctrl");
const ConteudoCtrl = require("../controllers/content-ctrl");

// Multer
const multer = require("multer");
const fileStorage = require("../src/multerConfig");

// Definição dos métodos para cada rota do usuário
router.post("/controle-usuario", UsuarioCtrl.inserirUsuario);
router.put("/controle-usuario/:id", UsuarioCtrl.atualizarUsuario);
router.delete("/controle-usuario/:id", UsuarioCtrl.removerUsuario);
router.get("/controle-usuario/:id", UsuarioCtrl.encUsuarioPorID);
router.get("/controle-usuario", UsuarioCtrl.listarUsuarios);

// Definição dos métodos para cada rota do conteúdo
router.post("/controle-conteudo", ConteudoCtrl.inserirConteudo);
router.put("/controle-conteudo/:id", ConteudoCtrl.atualizarConteudo);
router.delete("/controle-conteudo/:id", ConteudoCtrl.removerConteudo);
router.get("/controle-conteudo/:id", ConteudoCtrl.encConteudoPorID);
router.get("/controle-conteudo", ConteudoCtrl.listarConteudos);

// Rota para armazenamento de arquivos de mídia
router.post("/upload-arquivo", multer(fileStorage).single('file'), (req, res) => {
    console.log(req.file);
    // if (error) {
    //     console.log("Erro no upload", error);
    //     return res.json({ success: false, error });
    // } else {
    //     return res.json({
    //         success: true, 
    //         url: res.req.file.path, 
    //         fileName: res.req.file.filename
    //     })
    // }
});

module.exports = router;
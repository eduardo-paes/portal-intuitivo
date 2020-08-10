// Define as rotas que serão utilizadas para lidar com o banco de dados
const express = require("express");
const router = express.Router();

// Importação dos métodos de controle
const UsuarioCtrl = require("../controllers/user-ctrl");
const ConteudoCtrl = require("../controllers/content-ctrl");
const DisciplinaCtrl = require("../controllers/subject-ctrl");

// Multer
const multer = require("multer");
const multerConfig = require("./config/multer");
const fileStorage = require("../src/multerConfig");

// Definição dos métodos para cada rota do usuário
router.post("/controle-usuario", multer(multerConfig).single("foto"), UsuarioCtrl.inserirUsuario);
router.put("/controle-usuario/:id", multer(multerConfig).single("foto"), UsuarioCtrl.atualizarUsuario);
router.delete("/controle-usuario/:id", UsuarioCtrl.removerUsuario);
router.get("/controle-usuario/:id", UsuarioCtrl.encUsuarioPorID);
router.get("/controle-usuario", UsuarioCtrl.listarUsuarios);

// Definição dos métodos para cada rota do conteúdo
router.post("/controle-conteudo", multer(multerConfig).single("conteudo"), ConteudoCtrl.inserirConteudo);
router.put("/controle-conteudo/:id", multer(multerConfig).single("conteudo"), ConteudoCtrl.atualizarConteudo);
router.delete("/controle-conteudo/:id", ConteudoCtrl.removerConteudo);
router.get("/controle-conteudo/:id", ConteudoCtrl.encConteudoPorID);
router.get("/controle-conteudo", ConteudoCtrl.listarConteudos);

// Definição dos métodos para cada rota da disciplina
router.post("/configuracoes/disciplina", DisciplinaCtrl.inserirDisciplina);
router.put("/configuracoes/disciplina/:id", DisciplinaCtrl.atualizarDisciplina);
router.delete("/configuracoes/disciplina/:id", DisciplinaCtrl.removerDisciplina);
router.get("/configuracoes/disciplina/:id", DisciplinaCtrl.encDisciplinaPorID);
router.get("/configuracoes", DisciplinaCtrl.listarDisciplinas);

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
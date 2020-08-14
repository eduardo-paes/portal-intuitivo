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
const {conteudoUpload, fotoUpload, questaoUpload} = require("../src/multerConfig");


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");


// Definição dos métodos para cada rota do usuário
router.post("/controle-usuario", multer(fotoUpload).single("foto"), UsuarioCtrl.inserirUsuario);
router.put("/controle-usuario/:id", multer(fotoUpload).single("foto"), UsuarioCtrl.atualizarUsuario);
router.delete("/controle-usuario/:id", UsuarioCtrl.removerUsuario);
router.get("/controle-usuario/:id", UsuarioCtrl.encUsuarioPorID);
router.get("/controle-usuario", UsuarioCtrl.listarUsuarios);

// Definição dos métodos para cada rota do conteúdo
router.post("/controle-conteudo", multer(conteudoUpload).single("conteudo"), ConteudoCtrl.inserirConteudo);
router.put("/controle-conteudo/:id", multer(conteudoUpload).single("conteudo"), ConteudoCtrl.atualizarConteudo);
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
router.post("/upload-arquivo", multer(questaoUpload).single('file'), (req, res, err) => {
    console.log(req.file)

    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
});

module.exports = router;
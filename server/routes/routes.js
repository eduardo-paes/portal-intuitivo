// Define as rotas que serão utilizadas para lidar com o banco de dados
const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const router = express.Router();

// Aplicação do body-parser
router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json());

// Multer para importação de arquivos
const multer = require("multer");

// Importação dos métodos de controle
const UsuarioCtrl = require("../controllers/user-ctrl");
const ConteudoCtrl = require("../controllers/content-ctrl");
const DisciplinaCtrl = require("../controllers/subject-ctrl");
const TagCtrl = require("../controllers/tag-ctrl");
const QuestaoCtrl = require("../controllers/question-ctrl");

// USUÁRIO -- Definição dos métodos para cada rota do usuário
router.post("/controle-usuario", UsuarioCtrl.inserirUsuario);
router.put("/controle-usuario/:id", UsuarioCtrl.atualizarUsuario);
router.delete("/controle-usuario/:id", UsuarioCtrl.removerUsuario);
router.get("/controle-usuario/:id", UsuarioCtrl.encUsuarioPorID);
router.get("/controle-usuario", UsuarioCtrl.listarUsuarios);

// CONTEÚDO -- Definição dos métodos para cada rota do conteúdo
router.post("/controle-conteudo", ConteudoCtrl.inserirConteudo);
router.put("/controle-conteudo/:id", ConteudoCtrl.atualizarConteudo);
router.delete("/controle-conteudo/:id", ConteudoCtrl.removerConteudo);
router.get("/controle-conteudo/:id", ConteudoCtrl.encConteudoPorID);
router.get("/controle-conteudo", ConteudoCtrl.listarConteudos);
router.get("/controle-conteudo/disciplina/:id", ConteudoCtrl.listarConteudoPorDisciplina);

// DISCIPLINA -- Definição dos métodos para cada rota da disciplina
router.post("/configuracoes/disciplina", DisciplinaCtrl.inserirDisciplina);
router.put("/configuracoes/disciplina/:id", DisciplinaCtrl.atualizarDisciplina);
router.delete("/configuracoes/disciplina/:id", DisciplinaCtrl.removerDisciplina);
router.get("/configuracoes/disciplina/:id", DisciplinaCtrl.encDisciplinaPorID);
router.get("/configuracoes/disciplina", DisciplinaCtrl.listarDisciplinas);

// TAG -- Definição dos métodos para cada rota da tag
router.post("/configuracoes/tag", TagCtrl.inserirTag);
router.put("/configuracoes/tag/:id", TagCtrl.atualizarTag);
router.delete("/configuracoes/tag/:id", TagCtrl.removerTag);
router.get("/configuracoes/tag/:id", TagCtrl.encTagPorID);
router.get("/configuracoes/tag", TagCtrl.listarTags);
router.get("/configuracoes/tags/:id", TagCtrl.listarTagsPorDisciplina);

// QUESTÃO -- Definição dos métodos para cada rota de questão
router.post("/controle-questao", QuestaoCtrl.inserirQuestao);
router.put("/controle-questao/:id", QuestaoCtrl.atualizarQuestao);
router.delete("/controle-questao/:id", QuestaoCtrl.removerQuestao);
router.get("/controle-questao/:id", QuestaoCtrl.encQuestaoPorID);
router.get("/controle-questao", QuestaoCtrl.listarQuestao);
router.get("/controle-questao/topico/:id", QuestaoCtrl.listarQuestaoPorTopico);

// Rota para armazenamento de arquivos
router.post("/upload-questao", (req, res) => {
    const crypto = require("crypto");
    var fileName;
    let questaoStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "question"));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                fileName = `${hash.toString('hex')}-${file.originalname}`
                cb(null, fileName);
            });
        },
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
                return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
            }
            cb(null, true)
        }
    });

    const upload = multer({ storage: questaoStorage }).single("file");
    
    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.json({ uploaded: false, err });
        }
        return res.json({ uploaded: true, url: res.req.file.path , name: fileName});
    });
});

// Rota para armazenamento de conteúdo pdf
router.post("/upload-conteudo/:id", (req, res) => {
    let conteudoStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "content"));
        },
        filename: (req, file, cb) => {
            const fileName = `${req.params.id}.pdf`
            cb(null, fileName);
        }
    });

    const upload = multer({ storage: conteudoStorage }).single("conteudo");
    
    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.json({ success: true });
    });
});

// Rota para armazenamento da foto de perfil
router.post("/upload-profile/:id", (req, res) => {
    let id = req.params.id;
    let fotoStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "profile"));
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            file.key = { id }
            cb(null, `${ req.params.id + ".jpeg" }`);
        },
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
                return cb(res.status(400).end('only jpg, png, jpeg is allowed'), false);
            }
            cb(null, true)
        }
    });

    const upload = multer({ storage: fotoStorage }).single("foto");
    
    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.json({ success: true });
    });
});

module.exports = router;

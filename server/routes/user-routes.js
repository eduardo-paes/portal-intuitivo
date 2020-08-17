// Define as rotas que serão utilizadas para lidar com o banco de dados
const express = require("express");
const bodyparser = require("body-parser");
const router = express.Router();

router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json());

// Importação dos métodos de controle
const UsuarioCtrl = require("../controllers/user-ctrl");
const ConteudoCtrl = require("../controllers/content-ctrl");
const DisciplinaCtrl = require("../controllers/subject-ctrl");

// Multer
const multer = require("multer");
const {conteudoUpload, fotoUpload} = require("../src/multerConfig");

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

const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({uploadDir: __dirname + '../../uploads/question'})

router.post('/uploads', MultipartyMiddleware, (req, res) => {
    console.log(req.files.upload);
    // console.log(res.files.upload);
});

// Rota para armazenamento de arquivos de mídia
router.post("/upload-arquivo", (req, res) => {
    const path = require("path");

    let questaoStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "question"));
        },
        filename: (req, file, cb) => {
            cb(null, `question_${file.originalname}`);
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
            console.log("Erro: ", err);
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
});

module.exports = router;
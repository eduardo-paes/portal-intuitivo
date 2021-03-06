// ============================================================================
//  Rotas para armazenamento de arquivos
// ============================================================================
// Importação para uploade de arquivos
const router = require('./routes');
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk"); 
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const storageType = {
    questao: multerS3({
        s3: new aws.S3(),
        bucket: 'testeintuitivo/Questao',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read'
    }),
    redacao: multerS3({
        s3: new aws.S3(),
        bucket: 'testeintuitivo/Redacao',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read'
    }),
    conteudo: multerS3({
        s3: new aws.S3(),
        bucket: 'testeintuitivo/Conteudo',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read'
    }),
}

// Verifica qual o nome correto do arquivo no diretório
function checkCorrectFileName (fileName) {
    const pathEssay = path.resolve(__dirname, "..", "..", "uploads", "redacao");
    var files = fs.readdirSync(pathEssay);
    var correctPath = '';
    files.toString().split(',').forEach(file => {
        if (file.includes(fileName)) {
            correctPath = file;
        }
    })
    return correctPath;
}

// Rota para armazenamento de arquivos
router.post("/upload-questao", (req, res) => {
    storage = { 
        questao: multerS3({
            s3: new aws.S3(),
            bucket: 'testeintuitivo/Questao',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read'
        })
    }

    const upload = multer({ storage: storage["questao"], 
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
                return cb(res.status(400).end('Only jpg, png, mp4 is allowed'), false);
            }
            cb(null, true);
        }
    }).single("file");

    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: req.file.location });
    });
});

// Rota para armazenamento de conteúdo pdf
router.post("/upload-conteudo/:id", (req, res) => {  
    const { id } = req.params;

    storage = { 
        conteudo: multerS3({
            s3: new aws.S3(),
            bucket: 'testeintuitivo/Conteudo',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, id)
            }
        })
    }
    
    const upload = multer({ storage: storage["conteudo"], 
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            if (ext !== '.pdf') {
                return cb(res.status(400).end('Only pdf is allowed'), false);
            }
            cb(null, true)
        }
        }).single("conteudo");

    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: req.file.location });
    });
});

// Rota para armazenamento da foto de perfil
router.post("/upload-profile/:id", async (req, res) => {
    const { id } = req.params;
    storage = { 
        foto: multerS3({
            s3: new aws.S3(),
            bucket: 'testeintuitivo/Profile',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, id)
            }
        })
    }

    const upload = multer({ storage: storage["foto"] }).single("foto");
    
    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: req.file.location });
    });
});

// Rota para armazenamento da redação do aluno
router.post("/upload-redacao/:alunoID/:redacaoID", (req, res) => {
    const { alunoID, redacaoID } = req.params;

    storage = { 
        redacao: multerS3({
            s3: new aws.S3(),
            bucket: 'testeintuitivo/Redacao',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, alunoID + redacaoID)
            }
        })
    }

    const upload = multer({storage: storage["redacao"]}).single("redacao");

    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: req.file.location });
    });
});

// Rota para download da redação do aluno
router.get("/download-redacao/:alunoID/:redacaoID", (req, res) => {
    const { alunoID, redacaoID } = req.params;
    var fileName = checkCorrectFileName(alunoID + redacaoID);
    const pathEssay = path.resolve(__dirname, "..", "..", "uploads", "redacao", fileName);
    res.download(pathEssay);
});

// Rota para armazenamento da correção redação do aluno
router.post("/upload-redacao/corrigida/:alunoID/:redacaoID", (req, res) => {
    const { alunoID, redacaoID } = req.params;

    storage = { 
        redacao: multerS3({
            s3: new aws.S3(),
            bucket: 'testeintuitivo/Correcao',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, alunoID + redacaoID)
            }
        })
    }

    const upload = multer({storage: storage["redacao"]}).single("redacao");

    upload(req, res, err => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: req.file.location });
    });
});

module.exports = router;
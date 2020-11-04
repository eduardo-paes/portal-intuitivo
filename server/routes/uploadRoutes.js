// ============================================================================
//  Rotas para armazenamento de arquivos
// ============================================================================
// Importação para uploade de arquivos
const router = require('./routes');
const path = require("path");
const multer = require("multer");
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

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
        }
    });

    const upload = multer({ 
        storage: questaoStorage,
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
                return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
            }
            cb(null, true)
        }
     }).single("file");
    
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

// Rota para armazenamento da redação do aluno
router.post("/upload-redacao/:alunoID/:redacaoID", (req, res) => {
    let alunoID = req.params.alunoID;
    let redacaoID = req.params.redacaoID;

    let redacaoStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "redacao"));
        },
        filename: (req, file, cb) => {
            var ext = path.extname(file.originalname);
            if (ext !== '.pdf') {
                ext = '.jpg';
            }
            file.key = { alunoID, redacaoID }
            cb(null, `${ alunoID + redacaoID + ext }`);
        }
    });

    const removeCopyFile = async () => {
        const pathEssay = path.resolve(__dirname, "..", "..", "uploads", "redacao");
        const files = fs.readdirSync(pathEssay);
        
        var correctPath = '';
        files.toString().split(',').forEach(file => {
            if (file.includes(fileName)) {
                correctPath = file;
            }
        })

        if (correctPath !== '') {
            var filePath = path.resolve(__dirname, "..", "..", "uploads", "redacao", correctPath);
            await unlinkAsync(filePath);
        }
    }

    const upload = multer({ 
        storage: redacaoStorage,
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            removeCopyFile();
            if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== '.pdf') {
                return cb(res.status(400).end('Somente jpg, png, jpeg e pdf são permitidos.'), false);
            }
            cb(null, true)
        },
        limits: {
            // fileSize: 1024 * 1024
        }
    }).single("foto");
    
    upload(req, res, err => {
        if (!err) {
            return res.json({ success: true });
        }
        console.log(err);
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
    let alunoID = req.params.alunoID;
    let redacaoID = req.params.redacaoID;
    let fileName = alunoID + redacaoID;

    let redacaoStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "correcao"));
        },
        filename: (req, file, cb) => {
            var ext = path.extname(file.originalname);
            if (ext !== '.pdf') {
                ext = '.jpg';
            }
            file.key = { alunoID, redacaoID }
            cb(null, `corrigida-${ alunoID + redacaoID + ext }`);
        }
    });

    const removeCopyFile = async () => {
        const pathEssay = path.resolve(__dirname, "..", "..", "uploads", "correcao");
        const files = fs.readdirSync(pathEssay);
        
        var correctPath = '';
        files.toString().split(',').forEach(file => {
            if (file.includes(fileName)) {
                correctPath = file;
            }
        })

        if (correctPath !== '') {
            var filePath = path.resolve(__dirname, "..", "..", "uploads", "correcao", correctPath);
            await unlinkAsync(filePath);
        }
    }

    const upload = multer({ 
        storage: redacaoStorage,
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            removeCopyFile();
            if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== '.pdf') {
                return cb(res.status(400).end('Somente jpg, png, jpeg e pdf são permitidos.'), false);
            }
            cb(null, true)
        },
        limits:{
            // fileSize: 1024 * 1024
        }
    }).single("foto");
    
    upload(req, res, err => {
        if (!err) {
            return res.json({ success: true });
        }
        console.log("Erro de Upload: ", err);
    });
});

module.exports = router;
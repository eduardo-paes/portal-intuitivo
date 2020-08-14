const multer = require("multer");
const path = require("path");

const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const storageTypes = {
    questao: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "public", "uploads", "question"));
        },
        filename: (req, file, cb) => {
            file.key = `question.${file.originalname}`;
            cb(null, file.key);
        },
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
                return cb(res.status(400).end('Only jpg, png, mp4 is allowed.'), false);
            }
            cb(null, true)
        }
    }),
    
    foto: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "public", "uploads", "profile"));
        }, 
        filename: (req, file, cb) => {
            file.key = `profile.${file.originalname}`;
            cb(null, file.key);
        }     
    }),

    conteudo: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "public", "conteudo", "content"));
        }, 
        filename: (req, file, cb) => {
            file.key = `conteudo.${file.originalname}`;
            cb(null, file.key);
        }   
    }),
    
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'teste-exemplo',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            const fileName = `upload.${file.originalname}`;
        }
    }),
}

const fotoUpload = {
    dest: path.resolve(__dirname, "..", "..", "public", "uploads", "profile"),
    storage: storageTypes["foto"],
}

const conteudoUpload = {
    dest: path.resolve(__dirname, "..", "..", "public", "uploads", "content"),
    storage: storageTypes["conteudo"],
}

const questaoUpload = {
    dest: path.resolve(__dirname, "..", "..", "public", "uploads", "question"),
    storage: storageTypes["questao"]
}

module.exports = {
    fotoUpload,
    conteudoUpload,
    questaoUpload
};

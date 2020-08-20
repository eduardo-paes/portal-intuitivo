const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storageFoto = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "profile"));
        }, 
        filename: (req, file, cb) => {
            file.key = `profile.${file.originalname}`;
            cb(null, file.key);
        }     
});

const storageConteudo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "..", "uploads", "content"));
    }, 
    filename: (req, file, cb) => {
        file.key = `conteudo.${file.originalname}`;
        cb(null, file.key);
    }   
});

const storageQuestao = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "..", "uploads", "question"));
    }, 
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
            if (err) cb(err);
            const fileName = `${hash.toString('hex')}-${file.originalname}`
            cb(null, fileName);
        });
    },
});

const fotoUpload = {
    dest: path.resolve(__dirname, "..", "..", "uploads", "profile"),
    storage: storageTypes["foto"],
}

const conteudoUpload = {
    dest: path.resolve(__dirname, "..", "..", "uploads", "content"),
    storage: storageTypes["conteudo"],
}

const questaoUpload = {
    dest: path.resolve(__dirname, "..", "..", "uploads", "question"),
    storage: storageTypes["questao"],
}

module.exports = {
    storageFoto,
    storageConteudo,
    storageQuestao
};

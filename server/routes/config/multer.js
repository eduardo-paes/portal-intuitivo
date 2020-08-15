const multer = require("multer");
const path = require("path");

const storageTypes = {
    foto: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "profile"));
        }, 
        filename: (req, file, cb) => {
            file.key = `profile.${file.originalname}`;
            cb(null, file.key);
        }     
    }),

    conteudo: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "uploads", "content"));
        }, 
        filename: (req, file, cb) => {
            file.key = `conteudo.${file.originalname}`;
            cb(null, file.key);
        }   
    })
}

const fotoUpload = {
    dest: path.resolve(__dirname, "..", "..", "uploads", "profile"),
    storage: storageTypes["foto"],
}

const conteudoUpload = {
    dest: path.resolve(__dirname, "..", "..", "uploads", "content"),
    storage: storageTypes["conteudo"],
}

module.exports = {
    fotoUpload,
    conteudoUpload
};

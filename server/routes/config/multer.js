const multer = require("multer");
const path = require("path");

const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "public", "uploads"));
        }, 
        filename: (req, file, cb) => {
            file.key = `profile.${file.originalname}`;
            cb(null, file.key);
        }     
    }),
    conteudo: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "public", "conteudo"));
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

module.exports = {
    dest: path.resolve(__dirname, "..", "..", "public", "conteudo"),
    storage: storageTypes["conteudo"],
};

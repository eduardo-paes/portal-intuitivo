// Multer é necessário para o upload de arquivos
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Configurações do multer
module.exports = {
    // Destino do armazenamento padrão
    dest: path.resolve(__dirname, '..', '..', 'uploads'),
    // Configurações de armazenamento
    storage: multer.diskStorage({ 
        // Destino de armazenamento
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'uploads'))
        },
        // Nome do arquivo
        filename: (req, file, cb) => {
            // Gerando número aleatório para compor nome da imagem
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                const fileName = `${hash.toString('hex')}-${file.originalname}`
                cb(null, fileName);
            });
        },
    }),
    // Filtro para armazenamento
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'video/avi'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            return cb(new Error("Tipo de arquivo inválido."), false);
        }
    }
};
const Usuario = require('../models/users-model');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltLake = 11;

// Função para inserir usuário no banco
inserirUsuario = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Um usuário deve ser fornecido.",
        })
    }

    const novoUsuario = new Usuario(body);

    // Verifica se dados não são nulos
    if (!novoUsuario) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    bcrypt.genSalt(saltLake, function(errSalt, salt) {
        if (errSalt) {
            console.log("Erro GenSalt: ", err);
        }

        bcrypt.hash(novoUsuario.senha, salt, function(errHash, hash) {
            if (!errHash) { 
            // Encriptação de senha
            novoUsuario.senha = hash;

            // Salva novo usário
            novoUsuario
                .save()
                .then(() => {
                    return res.status(201).json({
                        success: true,
                        id: novoUsuario._id,
                        message: "Usuário inserido com sucesso!",
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: "Usuário não inserido!",
                    })
                });
            }
        });
    });
}

// Função para atualizar usuário por ID
atualizarUsuario = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const usuario = new Usuario(body);
    
    // Verifica se dados não são nulos
    if (!usuario) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    } 

    // Busca usuário pelo id (id da rota)
    Usuario.findOne({
        _id: req.params.id
    }, (err, usuarioEncontrado) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "Usuário não encontrado."})
        }
        
        // Atualiza dados do usuário encontrado
        usuarioEncontrado.nome = usuario.nome
        usuarioEncontrado.email = usuario.email
        usuarioEncontrado.acesso = usuario.acesso
        usuarioEncontrado.disciplina = usuario.disciplina
        usuarioEncontrado.url = usuario.url

        bcrypt.genSalt(saltLake, function(errSalt, salt) {
            if (errSalt) {
                console.log("Erro GenSalt: ", err);
            }
    
            bcrypt.hash(usuario.senha, salt, function(errHash, hash) {
                if (!errHash) { 
                    
                    if (usuarioEncontrado.senha !== usuario.senha) {
                        usuarioEncontrado.senha = hash;
                    }

                    // Salva alterações
                    usuarioEncontrado
                    .save()
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            id: usuarioEncontrado._id,
                            message:"Usuário atualizado com sucesso!",
                        })
                    })
                    .catch(error => {
                        return res.status(404).json({
                            error,
                            message: "Usuário não atualizado!",
                        })
                    });
                }
            });
        });
    });
}

// Função para remover usuário por ID
removerUsuario = async (req, res) => {
    // Encontra usuário pelo ID e remove
    await Usuario
        .findOneAndDelete({
            _id: req.params.id
        }, (err, usuarioEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!usuarioEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Usuário não encontrado."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: usuarioEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar usuário por ID
encUsuarioPorID = async (req, res) => {
    // Encontra usuário por ID fornecido na rota
    await Usuario
        .findOne({
            _id: req.params.id
        }, (err, usuarioEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!usuarioEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Usuário não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: usuarioEncontrado})
        })
        .catch(err => console.log(err))
}

encUsuarioPorEmail = async (req, res) => {
    // Encontra usuário pelo email fornecido na rota
    await Usuario
        .findOne({
            email: req.params.email
        }, (err, usuarioEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!usuarioEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Usuário não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: usuarioEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para listar os usuários contidos no banco
listarUsuarios = async (req, res) => {   
    await Usuario.find({}).sort({nome: 1})
        .then((listaUsuarios, err) => {
            // Verificação de erros
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            // Verifica se há dados na lista
            if (!listaUsuarios.length) {
                return res
                    .status(404)
                    .json({ success: false, error: "Dados não encontrados." })
            }
            // Caso não haja erros, retorna dados
            return res.status(200).json({ success: true, data: listaUsuarios })
        }).catch(err => console.log(err));
}

// Função para validar usuário e senha fornecidos durante autenticação
confirmarUsuario = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Usuário não fornecido.",
        })
    }

    const usuarioRecebido = new Usuario(body);

    // Verifica se dados são nulos
    if (!usuarioRecebido) {
        return res
            .status(400)
            .json({
                success: false, 
                error: "Dados inválidos."
            });
    }

    await Usuario.findOne({
        email: usuarioRecebido.email
    }, (err, usuarioEncontrado) => {

        if (err) {
            return res.status(404).json({
                success: false,
                error: "Usuário não identificado.",
            })
        }
        
        if (usuarioEncontrado) {

            bcrypt.compare(usuarioRecebido.senha, usuarioEncontrado.senha).then(function(result) {
                if (result) {
                    const token = {
                        userID: usuarioEncontrado._id,
                        userName: usuarioEncontrado.nome,
                        accessType: usuarioEncontrado.acesso,
                        disciplina: usuarioEncontrado.disciplina ? usuarioEncontrado.disciplina : [],
                        url: usuarioEncontrado.url
                    }

                    return res.status(200).json({
                        success: true, 
                        data: token
                    });
                }

                return res.status(404).json({
                    success: false,
                    error: "Usuário ou senha inválido.",
                })
            });

        } else {
            return res.status(404).json({
                success: false,
                error: "Usuário ou senha inválido.",
            })
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(404).json({
            success: false,
            error: "Usuário ou senha inválido.",
        })
    })
}

// Exporta os módulos
module.exports = {
    inserirUsuario,
    atualizarUsuario,
    removerUsuario,
    encUsuarioPorID,
    encUsuarioPorEmail,
    listarUsuarios,
    confirmarUsuario
}
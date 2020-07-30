const Usuario = require('../models/users-model');

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
        usuarioEncontrado.senha = usuario.senha
        usuarioEncontrado.nomeArquivo = usuario.nomeArquivo
        usuarioEncontrado.urlArquivo = usuario.urlArquivo

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

// Função para listar os usuários contidos no banco
listarUsuarios = async (req, res) => {
    await Usuario.find({}, (err, listaUsuarios) => {
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
        // Caso não haja erros, retorna lista de usuários
        return res.status(200).json({ success: true, data: listaUsuarios })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirUsuario,
    atualizarUsuario,
    removerUsuario,
    encUsuarioPorID,
    listarUsuarios
}
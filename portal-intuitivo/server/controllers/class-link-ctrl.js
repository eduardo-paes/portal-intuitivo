const ClassLink = require('../models/class-link-model');

// Função para inserir classLink no banco
inserirClassLink = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A classLink deve ser fornecida.",
        })
    }

    const novaClassLink = new ClassLink(body);

    // Verifica se dados não são nulos
    if (!novaClassLink) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva nova classLink
    novaClassLink
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaClassLink._id,
                message: "ClassLink inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "ClassLink não inserida.",
            })
        });
}

// Função para atualizar classLink por ID
atualizarClassLink = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const classLink = new ClassLink(body);

    // Verifica se dados não são nulos
    if (!classLink) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca classLink pelo id (id da rota)
    ClassLink.findOne({
        _id: req.params.id
    }, (err, classLinkEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "ClassLink não encontrada."})
        }

        // Atualiza dados do classLink encontrada
        classLinkEncontrada.aulaLink = classLink.aulaLink

        // Salva alterações
        classLinkEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: classLinkEncontrada._id,
                    message:"ClassLink atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "ClassLink não atualizada.",
                })
            });
    });
}

// Função para remover classLink por ID
removerClassLink = async (req, res) => {
    // Encontra classLink pelo ID e remove
    await ClassLink
        .findOneAndDelete({
            _id: req.params.id
        }, (err, classLinkEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            console.log(err)

            if (!classLinkEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "ClassLink não encontrada."})
            }

            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: classLinkEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para buscar classLink por ID
encClassLinkPorID = async (req, res) => {
    // Encontra classLink por ID fornecido na rota
    await ClassLink
        .findOne({
            _id: req.params.id
        }, (err, classLinkEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!classLinkEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "ClassLink não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: classLinkEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar os classLinks contidos no banco
listarClassLink = async (req, res) => {
    await ClassLink.find({}, (err, listaClassLinks) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaClassLinks.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de classLinks
        return res.status(200).json({ success: true, data: listaClassLinks })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirClassLink,
    atualizarClassLink,
    removerClassLink,
    encClassLinkPorID,
    listarClassLink
}
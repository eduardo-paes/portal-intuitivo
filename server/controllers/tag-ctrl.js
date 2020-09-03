const Tag = require('../models/tag-model');

// Função para inserir tag no banco
inserirTag = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A tag deve ser fornecida.",
        })
    }

    const novaTag = new Tag(body);

    // Verifica se dados não são nulos
    if (!novaTag) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva nova tag
    novaTag
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaTag._id,
                message: "Tag inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "Tag não inserida.",
            })
        });
}

// Função para atualizar tag por ID
atualizarTag = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const tag = new Tag(body);

    // Verifica se dados não são nulos
    if (!tag) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca tag pelo id (id da rota)
    Tag.findOne({
        _id: req.params.id
    }, (err, tagEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "Tag não encontrada."})
        }

        // Atualiza dados do tag encontrada
        tagEncontrada.nome = tag.nome
        tagEncontrada.disciplinaID = tag.disciplinaID

        // Salva alterações
        tagEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: tagEncontrada._id,
                    message:"Tag atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Tag não atualizada.",
                })
            });
    });
}

// Função para remover tag por ID
removerTag = async (req, res) => {
    // Encontra tag pelo ID e remove
    await Tag
        .findOneAndDelete({
            _id: req.params.id
        }, (err, tagEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!tagEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Tag não encontrada."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: tagEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para buscar tag por ID
encTagPorID = async (req, res) => {
    // Encontra tag por ID fornecido na rota
    await Tag
        .findOne({
            _id: req.params.id
        }, (err, tagEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!tagEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Tag não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: tagEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar os tags contidos no banco
listarTags = async (req, res) => {
    await Tag.aggregate([{
        $lookup: {
            from: "disciplinas",
            localField: "disciplinaID",
            foreignField: "_id",
            as:"disciplina"
        }
    }], (err, listaTags) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaTags.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de tags
        return res.status(200).json({ success: true, data: listaTags })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Função para listar os tags contidos no banco
listarTagsPorDisciplina = async (req, res) => {
    await Tag
        .find({
            disciplinaID: req.params.id
        }, (err, listaTags) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaTags.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de tags
        return res.status(200).json({ success: true, data: listaTags })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirTag,
    atualizarTag,
    removerTag,
    encTagPorID,
    listarTags,
    listarTagsPorDisciplina
}
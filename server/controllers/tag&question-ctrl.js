const TagQuestao = require('../models/tag&question-model');

// Função para inserir tagQuestao no banco
inserirTagQuestao = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A tagQuestao deve ser fornecida.",
        })
    }

    const novaTagQuestao = new TagQuestao(body);

    // Verifica se dados não são nulos
    if (!novaTagQuestao) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva nova tagQuestao
    novaTagQuestao
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaTagQuestao._id,
                message: "TagQuestao inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "TagQuestao não inserida.",
            })
        });
}

// Função para atualizar tagQuestao por ID
atualizarTagQuestao = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const tagQuestao = new TagQuestao(body);

    // Verifica se dados não são nulos
    if (!tagQuestao) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca tagQuestao pelo id (id da rota)
    TagQuestao.findOne({
        _id: req.params.id
    }, (err, tagQuestaoEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "TagQuestao não encontrada."})
        }

        // Atualiza dados do tagQuestao encontrada
        tagQuestaoEncontrada.tagID = tagQuestao.tagID
        tagQuestaoEncontrada.questaoID = tagQuestao.questaoID
        
        // Salva alterações
        tagQuestaoEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: tagQuestaoEncontrada._id,
                    message:"TagQuestao atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "TagQuestao não atualizada.",
                })
            });
    });
}

// Função para remover tagQuestao por ID
removerTagQuestao = async (req, res) => {
    // Encontra tagQuestao pelo ID e remove
    await TagQuestao
        .findOneAndDelete({
            _id: req.params.id
        }, (err, tagQuestaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!tagQuestaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "TagQuestao não encontrada."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: tagQuestaoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para buscar tagQuestao por ID
encTagQuestaoPorID = async (req, res) => {
    // Encontra tagQuestao por ID fornecido na rota
    await TagQuestao
        .findOne({
            _id: req.params.id
        }, (err, tagQuestaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!tagQuestaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "TagQuestao não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: tagQuestaoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar os tagQuestaos contidos no banco
listarTagQuestao = async (req, res) => {
    await TagQuestao.aggregate([
        {
            $lookup: {
                from: "tags",
                localField: "tagID",
                foreignField: "_id",
                as:"tagInfo"
            }
        },
    ], (err, listaTagQuestao) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaTagQuestao.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista
        return res.status(200).json({ success: true, data: listaTagQuestao })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// ======================================
// FUNÇÕES POR QUESTÃO-ID
// ======================================

// Função para listar os tagQuestaos contidos no banco
listarTQPorQuestaoID = async (req, res) => {
    await TagQuestao.aggregate([
        {
            $lookup: {
                from: "tags",
                localField: "tagID",
                foreignField: "_id",
                as:"tagInfo"
            }
        },
        {
            $match : {
                "tagInfo.questaoID": req.params.questaoID
            }
        },
    ], (err, listaTagQuestao) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaTagQuestao.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }

        console.log(listaTagQuestao);
        // Caso não haja erros, retorna lista
        return res.status(200).json({ success: true, data: listaTagQuestao })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirTagQuestao,
    atualizarTagQuestao,
    removerTagQuestao,
    encTagQuestaoPorID,
    listarTagQuestao,
    listarTQPorQuestaoID
}
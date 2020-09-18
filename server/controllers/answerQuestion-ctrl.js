const TagQuestao = require('../models/tag&question-model');

// Função para inserir tagQuestao no banco
inserirRespostaQuestao = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A resposta da questão deve ser fornecida.",
        })
    }

    const novaRespostaQuestao = new RespostaQuestao(body);

    // Verifica se dados não são nulos
    if (!novaRespostaQuestao) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva nova tagQuestao
    novaRespostaQuestao
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaRespostaQuestao._id,
                message: "Resposta da questão inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "Resposta da questão não inserida.",
            })
        });
}

// Função para buscar tagQuestao por ID
encRespostaQuestaoPorID = async (req, res) => {
    // Encontra tagQuestao por ID fornecido na rota
    await RespostaQuestao
        .findOne({
            _id: req.params.id
        }, (err, respostaQuestaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!respostaQuestaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Resposta da questão não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaQuestaoEncontrada})
        })
        .catch(err => console.log(err))
}

// ======================================
// FUNÇÕES POR QUESTÃO-ID
// ======================================

// Função para listar TQ por QuestaoID
listarRQPorQuestaoID = async (req, res) => {
    await RespostaQuestao
        .find({ questaoID: req.params.id }, 
            (err, respostaQuestaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!respostaQuestaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Resposta da Questão não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaQuestaoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar TQ por TagID
listarRQPorAlunoID = async (req, res) => {
    await RespostaQuestao
        .find({ alunoID: req.params.id }, 
            (err, respostaQuestaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!respostaQuestaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Resposta da Questão não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaQuestaoEncontrada})
        })
        .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirTagQuestao,
    atualizarTagQuestao,
    removerTagQuestao,
    encTagQuestaoPorID,
    listarTagQuestao,
    listarTQPorQuestaoID,
    listarTQPorTagID
}
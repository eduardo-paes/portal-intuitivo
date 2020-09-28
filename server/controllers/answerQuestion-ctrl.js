const RespostaQuestao = require('../models/answerQuestion-model');

// Função para inserir respostaQuestao no banco
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

    // console.log(novaRespostaQuestao)

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

// Função para remover respostaQuestao por ID
removerRespostaQuestao = async (req, res) => {
    // Encontra respostaQuestao pelo ID e remove
    await RespostaQuestao
        .findOneAndDelete({
            _id: req.params.id
        }, (err, respostaQuestaoEncontrada) => {


            if (err) {
                console.log (err);
                return res
                    .status(400)
                    .json({
                        success: false, 
                        error: err
                    })
            }
            
            // Caso não encontre nenhuma respostaQuestão
            if (!respostaQuestaoEncontrada) {
                return res
                    .status(404)
                    .json({
                        success: false, 
                        error: "Questao não encontrado."
                    })
            }

            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({
                    success: true, 
                    data: respostaQuestaoEncontrada
                })
        })
        .catch(err => console.log(err))
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

// Função para listar respostaQuestao contidos no banco
listarRespostaQuestao = async (req, res) => {
    await RespostaQuestao.find({})
    .exec(function (err, listaRespostaQuestao) {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaRespostaQuestao.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de questaos
        return res.status(200).json({ success: true, data: listaRespostaQuestao })
    });
}

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
    inserirRespostaQuestao,
    removerRespostaQuestao,
    encRespostaQuestaoPorID,
    listarRespostaQuestao,
    listarRQPorQuestaoID,
    listarRQPorAlunoID
}
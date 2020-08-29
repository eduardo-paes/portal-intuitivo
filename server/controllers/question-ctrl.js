const Questao = require('../models/question-model');

// Função para inserir questao no banco
inserirQuestao = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A questao deve ser fornecida.",
        })
    }

    const novaQuestao = new Questao(body);

    // Verifica se dados não são nulos
    if (!novaQuestao) {
        console.log("Erro - nova questão")
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva novo usário
    novaQuestao
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaQuestao._id,
                message: "Questão inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "Questão não inserida.",
            })
        });
}

// Função para atualizar questao por ID
atualizarQuestao = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const questaoAtualizada = new Questao(body);

    // Verifica se dados não são nulos
    if (!questaoAtualizada) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca questão pelo id (id da rota)
    Questao.findOne({
        _id: req.params.id
    }, (err, questaoEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({
                    err, 
                    message: "Questao não encontrada."
                })
        }

        // Atualiza dados da questão encontrada
        questaoEncontrada.disciplina = questaoAtualizada.disciplina
        questaoEncontrada.topico = questaoAtualizada.topico
        questaoEncontrada.enunciado = questaoAtualizada.enunciado
        questaoEncontrada.tipoResposta = questaoAtualizada.tipoResposta
        questaoEncontrada.resposta = questaoAtualizada.resposta
        questaoEncontrada.dataEdicao = questaoAtualizada.dataEdicao

        // Salva alterações
        questaoEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: questaoEncontrada._id,
                    message:"Questao atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Questao não atualizada.",
                })
            });
    });
}

// Função para remover questao por ID
removerQuestao = async (req, res) => {
    // Encontra questao pelo ID e remove
    await Questao
        .findOneAndDelete({
            _id: req.params.id
        }, (err, questaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!questaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Questao não encontrado."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: questaoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para buscar questao por ID
encQuestaoPorID = async (req, res) => {
    // Encontra questao por ID fornecido na rota
    await Questao
        .findOne({
            _id: req.params.id
        }, (err, questaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!questaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Questao não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: questaoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar os questaos contidos no banco
listarQuestao = async (req, res) => {
    await Questao.find({}, (err, listaQuestao) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaQuestao.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de questaos
        return res.status(200).json({ success: true, data: listaQuestao })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirQuestao,
    atualizarQuestao,
    removerQuestao,
    encQuestaoPorID,
    listarQuestao
}
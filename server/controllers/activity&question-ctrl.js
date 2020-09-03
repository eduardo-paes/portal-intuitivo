const AtividadeQuestao = require('../models/activity&question-model');

// Função para inserir relação Atividade/Questão no banco
inserirAtividadeQuestao = (req, res) => {
    // Recebe IDs: questão e atividade
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "IDs devem ser fornecidos.",
        })
    }

    const novaAtividadeQuestao = new AtividadeQuestao(body);

    // Verifica se dados não são nulos
    if (!novaAtividadeQuestao) {
        return res
            .status(400)
            .json({
                success: false, 
                error: err
            });
    }

    // Salva nova relação Atividade/Questão
    novaAtividadeQuestao
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaAtividadeQuestao._id,
                message: "Relação Atividade/Questão inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "Relação Atividade/Questão não inserida.",
            })
        });
}

// Função para atualizar relação Atividade/Questão por ID
atualizarAtividadeQuestao = async (req, res) => {
    // Recebe IDs: questão e atividade
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const atividadeQuestaoAtualizada = new AtividadeQuestao(body);

    // Verifica se dados não são nulos
    if (!atividadeQuestaoAtualizada) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca relação pelo id (id da rota)
    Questao.findOne({
        _id: req.params.id
    }, (err, atividadeQuestaoEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({
                    err, 
                    message: "Relação não encontrada."
                })
        }

        // Atualiza dados da relação encontrada
        atividadeQuestaoEncontrada.questaoID = atividadeQuestaoAtualizada.questaoID
        atividadeQuestaoEncontrada.atividadeID = atividadeQuestaoAtualizada.atividadeID

        // Salva alterações
        atividadeQuestaoEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: atividadeQuestaoEncontrada._id,
                    message:"Relação atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Relação não atualizada.",
                })
            });
    });
}

// Função para remover questao por ID
removerAtividadeQuestao = async (req, res) => {
    // Encontra relação pelo ID e remove
    await AtividadeQuestao
        .findOneAndDelete({
            _id: req.params.id
        }, (err, atividadeQuestaoEncontrada) => {

            // Caso haja erro
            if (err) {
                console.log (err);
                return res
                    .status(400)
                    .json({
                        success: false, 
                        error: err
                    })
            }
            
            // Caso não encontre nenhuma relação
            if (!atividadeQuestaoEncontrada) {
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
                    data: atividadeQuestaoEncontrada
                })
        })
        .catch(err => console.log(err))
}

// Função para buscar questao por ID
encAtividadeQuestaoPorID = async (req, res) => {
    // Encontra questao por ID fornecido na rota
    await AtividadeQuestao
        .findOne({
            _id: req.params.id
        }, (err, atividadeQuestaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!atividadeQuestaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Questao não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: atividadeQuestaoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar os questaos contidos no banco
listarAtividadeQuestao = async (req, res) => {
    await AtividadeQuestao.find({}, (err, listaAtividadeQuestao) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaAtividadeQuestao.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de relacoes
        return res.status(200).json({ success: true, data: listaAtividadeQuestao })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}


// Exporta os módulos
module.exports = {
    inserirAtividadeQuestao,
    atualizarAtividadeQuestao,
    removerAtividadeQuestao,
    encAtividadeQuestaoPorID,
    listarAtividadeQuestao,
}
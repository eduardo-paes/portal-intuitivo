const Atividade = require('../models/activity-model');

// Função para inserir atividade no banco
inserirAtividade = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A atividade deve ser fornecida.",
        })
    }

    const novaAtividade = new Atividade(body);

    // Verifica se dados não são nulos
    if (!novaAtividade) {
        return res
            .status(406)
            .json({
                success: false, 
                error: err
            });
    }

    // Salva nova atividade
    novaAtividade
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaAtividade._id,
                message: "Atividade inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(404).json({
                error,
                message: "Atividade não inserida.",
            })
        });
}

// Função para atualizar atividade por ID
atualizarAtividade = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const atividadeAtualizada = new Atividade(body);

    // Verifica se dados não são nulos
    if (!atividadeAtualizada) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca atividade pelo id (id da rota)
    Atividade.findOne({
        _id: req.params.id
    }, (err, atividadeEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({
                    err, 
                    message: "Atividade não encontrada."
                })
        }

        // Atualiza dados da atividade encontrada
        atividadeEncontrada.tipoAtividade = atividadeAtualizada.tipoAtividade
        atividadeEncontrada.disciplina = atividadeAtualizada.disciplina
        atividadeEncontrada.areaConhecimento = atividadeAtualizada.areaConhecimento
        atividadeEncontrada.numeracao = atividadeAtualizada.numeracao
        atividadeEncontrada.questoes = atividadeAtualizada.questoes
        atividadeEncontrada.dataCriacao = atividadeAtualizada.dataCriacao
        atividadeEncontrada.dataModificacao = atividadeAtualizada.dataModificacao

        // Salva alterações
        atividadeEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: atividadeEncontrada._id,
                    message:"Atividade atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Atividade não atualizada.",
                })
            });
    });
}

// Função para remover atividade por ID
removerAtividade = async (req, res) => {
    // Encontra atividade pelo ID e remove
    await Atividade
        .findOneAndDelete({
            _id: req.params.id
        }, (err, atividadeEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!atividadeEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Atividade não encontrado."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: atividadeEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para buscar atividade por ID
encAtividadePorID = async (req, res) => {
    // Encontra atividade por ID fornecido na rota
    await Atividade
        .findOne({
            _id: req.params.id
        }, (err, atividadeEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!atividadeEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Atividade não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: atividadeEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar os atividades contidos no banco
listarAtividade = async (req, res) => {
    await Atividade.find({}, (err, listaAtividade) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaAtividade.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de atividades
        return res.status(200).json({ success: true, data: listaAtividade })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Função para listar os atividades contidos no banco
listarAtividadesPorTopico = async (req, res) => {
    await Atividade.find({
        "topico.id": req.params.id
    }, (err, listaAtividade) => {
        // Verificação de erros
        console.log(listaAtividade)
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaAtividade.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de atividades
        return res.status(200).json({ success: true, data: listaAtividade })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirAtividade,
    atualizarAtividade,
    removerAtividade,
    encAtividadePorID,
    listarAtividade,
    listarAtividadesPorTopico
}
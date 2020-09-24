const Atividade = require('../models/activity-model');
const AtividadeQuestao = require('../models/activity&question-model');
const mongoose = require('mongoose');

// ======================================
// FUNÇÕES DE QUESTÃO-ATIVIDADE
// ======================================

// Função para inserir tagQuestao no banco
inserirAtividadeQuestao = async (questaoID, atividadeID, qaID) => {
    const body = { _id: qaID, questaoID: questaoID, atividadeID: atividadeID };
    const novaQuestaoAtividade = new AtividadeQuestao(body);
    await novaQuestaoAtividade.save();
}

// Função para remover tagQuestao no banco
removerAtividadeQuestao = (qaID) => {
    AtividadeQuestao.findOneAndDelete({ _id: qaID}, err => {
        if (err) {
            console.log(err);
            return false;
        }
        return true;
    })
    .catch(err => console.log(err))
}

// ======================================
// FUNÇÕES DE ATIVIDADE
// ======================================

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

    novaAtividade._id = mongoose.Types.ObjectId();

    // Inserir QuestaoAtividade
    if (novaAtividade.questoes.length > 0) {
        let qaID, arrayQuestoes = [];
        // Insere as QAs
        novaAtividade.questoes.map(questaoID => {
            qaID = mongoose.Types.ObjectId();
            arrayQuestoes.push(qaID);
            inserirAtividadeQuestao(questaoID, novaAtividade._id, qaID);
        })
        novaAtividade.questoes = arrayQuestoes;
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
            console.log(error);
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

        // Verificação de Questões
        let questoesAntigas = atividadeEncontrada.questoes;
        let questoesAtualizadas = atividadeAtualizada.questoes;

        // Caso ambas as versões possuam questoes
        if (questoesAtualizadas.length > 0) {
            // Remove todas as QuestoesAtividade antigas
            if (questoesAntigas.length > 0) {
                questoesAntigas.forEach(oldQaID => {
                    removerAtividadeQuestao(oldQaID);
                })
            }

            // Insere todas as QuestoesAtividade novas
            let atividadeID = atividadeEncontrada._id;
            let qaID, arrayQuestoes = [];
            
            questoesAtualizadas.forEach(tagID => {
                qaID = mongoose.Types.ObjectId();
                arrayQuestoes.push(qaID);
                inserirAtividadeQuestao(questaoID, atividadeID, qaID);
            })

            // Atualiza QAs
            atividadeEncontrada.questoes = arrayQuestoes;
        }

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
        atividadeEncontrada.disciplinaID = atividadeAtualizada.disciplinaID
        atividadeEncontrada.topicoID = atividadeAtualizada.topicoID
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
    await Atividade.findOne({ _id: req.params.id })
        .populate('questoes')
        .exec((err, atividadeEncontrada) => {
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
        });
}

// Função para listar os atividades contidos no banco
listarAtividade = async (req, res) => {
    await Atividade.find({})
        .populate('disciplinaID', 'nome')
        .populate('topicoID', 'topico')
        .exec((err, listaAtividade) => {
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
}

// Função para listar os atividades contidos no banco
listarAtividadesPorTopico = async (req, res) => {
    await Atividade.find({ "topicoID": req.params.id })
    .populate('disciplinaID', 'nome')
    .populate('topicoID', 'topico')
    .exec((err, listaAtividade) => {
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
const Revisao = require('../models/revision-model');
const AtividadeQuestao = require('../models/activityQuestion-model');
const mongoose = require('mongoose');

// ======================================
// FUNÇÕES DE QUESTÃO-ATIVIDADE
// ======================================

// Função para inserir tagQuestao no banco
inserirAtividadeQuestao = async (qaID, questaoID, atividadeID) => {
    const body = { _id: qaID, questaoID: questaoID, atividadeID: atividadeID };
    const novaQuestaoAtividade = new AtividadeQuestao(body);
    await novaQuestaoAtividade.save();
}

// ======================================
// FUNÇÕES DE REVISÃO
// ======================================

// Função para inserir revisao no banco
inserirRevisao = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A revisão deve ser fornecida.",
        })
    }

    const novaRevisao = new Revisao(body);

    // Verifica se dados não são nulos
    if (!novaRevisao) {
        return res
            .status(406)
            .json({
                success: false, 
                error: err
            });
    }

    // Cria id para revisão
    novaRevisao._id = mongoose.Types.ObjectId();

    // Inserir QuestaoAtividade
    if (novaRevisao.questoes.length > 0) {
        let qaID, arrayQuestoes = [];
        let atividadeID = novaRevisao._id;
        // Insere as QAs
        novaRevisao.questoes.map(questaoID => {
            // Cria id para questaoAtividade
            qaID = mongoose.Types.ObjectId();
            // Salva esse id num array
            arrayQuestoes.push(qaID);
            // Insere atividadeQuestao
            inserirAtividadeQuestao(qaID, questaoID, atividadeID);
        })
        // Salva array com os ids de atividadeQuestao na nova revisão
        novaRevisao.questoes = arrayQuestoes;
    }

    // Salva nova revisao
    novaRevisao
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaRevisao._id,
                message: "Revisão inserida com sucesso!",
            })
        })
        .catch(error => {
            console.log(error)
            return res.status(404).json({
                error,
                message: "Revisão não inserida.",
            })
        });
}

// Função para atualizar revisao por ID
atualizarRevisao = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const revisaoAtualizada = new Revisao(body);

    // Verifica se dados não são nulos
    if (!revisaoAtualizada) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca revisão pelo id (id da rota)
    Revisao.findOne({
        _id: req.params.id
    }, (err, revisaoEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({
                    err, 
                    message: "Revisao não encontrada."
                })
        }

        // Atualiza dados da revisao encontrada
        revisaoEncontrada.tipoAtividade = revisaoAtualizada.tipoAtividade
        revisaoEncontrada.areaConhecimento = revisaoAtualizada.areaConhecimento
        revisaoEncontrada.numeracao = revisaoAtualizada.numeracao
        revisaoEncontrada.dataCriacao = revisaoAtualizada.dataCriacao
        revisaoEncontrada.dataModificacao = revisaoAtualizada.dataModificacao

        // Verificação de Questões
        let questoesAntigas = revisaoEncontrada.questoes;
        let questoesAtualizadas = revisaoAtualizada.questoes;

        // Caso ambas as versões possuam questoes
        if (questoesAtualizadas.length) {

            // Remove todas as QuestoesAtividade antigas
            if (questoesAntigas.length) {
                let atividadeID = revisaoAtualizada._id;
                AtividadeQuestao.deleteMany({ atividadeID: atividadeID });
            }

            // Insere todas as QuestoesAtividade novas
            let atividadeID = revisaoEncontrada._id;
            let qaID, arrayQuestoes = [];
            
            questoesAtualizadas.forEach(questaoID => {
                qaID = mongoose.Types.ObjectId();
                arrayQuestoes.push(qaID);
                inserirAtividadeQuestao(qaID, questaoID, atividadeID);
            })

            // Atualiza QAs
            revisaoEncontrada.questoes = arrayQuestoes;
        }

        // Caso a selecão atualizada de questões seja vazia
        else {
            // Remove todas as AtividadeQuestoes antes de atualizar
            AtividadeQuestao.deleteMany({ atividadeID: req.params.id });
            revisaoEncontrada.questoes = revisaoAtualizada.questoes
        }

        // Salva alterações
        revisaoEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: revisaoEncontrada._id,
                    message:"Revisao atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Revisao não atualizada.",
                })
            });
    });
}

// Função para remover revisao por ID
removerRevisao = async (req, res) => {
    // Encontra revisao pelo ID e remove
    await Revisao
        .findOneAndDelete({
            _id: req.params.id
        }, (err, revisaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!revisaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Revisao não encontrado."})
            }

            // Remove antes todas as AtividadeQuestoes
            AtividadeQuestao.deleteMany({ atividadeID: req.params.id });

            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: revisaoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para buscar revisao por ID
encRevisaoPorID = async (req, res) => {
    // Encontra revisao por ID fornecido na rota
    await Revisao
        .findOne({ _id: req.params.id })
        .populate({ path: 'questoes', select: 'questaoID'})
        .exec((err, revisaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!revisaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Revisão não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: revisaoEncontrada})
        })
}

encRevisaoPelaNumeracaoEArea = async (req, res) => {
    // Encontra revisao por ID fornecido na rota
    await Revisao
    .findOne({ numeracao: req.params.numeracao, areaConhecimento: req.params.area })
    .populate({ path: 'questoes', select: 'questaoID'})
    .exec((err, revisaoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!revisaoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Revisão não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: revisaoEncontrada})
        })
}

// Função para listar os revisaos contidos no banco
listarRevisao = async (req, res) => {
    await Revisao.find({}, (err, listaRevisao) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ 
                success: false, 
                error: err 
            })
        }

        // Verifica se há dados na lista
        if (!listaRevisao.length) {
            return res
                .status(404)
                .json({ 
                    success: false, 
                    error: "Dados não encontrados." 
                })
        }
        // Caso não haja erros, retorna lista de revisaos
        return res.status(200).json({ 
            success: true, 
            data: listaRevisao 
        })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirRevisao,
    atualizarRevisao,
    removerRevisao,
    encRevisaoPorID,
    encRevisaoPelaNumeracaoEArea,
    listarRevisao
}
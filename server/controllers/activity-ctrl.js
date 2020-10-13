const Atividade = require('../models/activity-model');
const AtividadeQuestao = require('../models/activity&question-model');
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

    // Cria id para atividade
    novaAtividade._id = mongoose.Types.ObjectId();

    // Inserir QuestaoAtividade
    if (novaAtividade.questoes.length > 0) {
        let qaID, arrayQuestoes = [];
        let atividadeID = novaAtividade._id;
        // Insere as QAs
        novaAtividade.questoes.map(questaoID => {
            // Cria id para questaoAtividade
            qaID = mongoose.Types.ObjectId();
            // Salva esse id num array
            arrayQuestoes.push(qaID);
            // Insere atividadeQuestao
            inserirAtividadeQuestao(qaID, questaoID, atividadeID);
        })
        // Salva array com os ids de atividadeQuestao na nova atividade
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

        // Atualiza dados da atividade encontrada
        atividadeEncontrada.tipoAtividade = atividadeAtualizada.tipoAtividade
        atividadeEncontrada.disciplinaID = atividadeAtualizada.disciplinaID
        atividadeEncontrada.topicoID = atividadeAtualizada.topicoID
        atividadeEncontrada.areaConhecimento = atividadeAtualizada.areaConhecimento
        atividadeEncontrada.numeracao = atividadeAtualizada.numeracao
        atividadeEncontrada.dataCriacao = atividadeAtualizada.dataCriacao
        atividadeEncontrada.dataModificacao = atividadeAtualizada.dataModificacao

        // Verificação de Questões
        let questoesAntigas = atividadeEncontrada.questoes;
        let questoesAtualizadas = atividadeAtualizada.questoes;

        // Caso ambas as versões possuam questoes
        if (questoesAtualizadas.length) {

            // Remove todas as QuestoesAtividade antigas
            if (questoesAntigas.length) {
                let atividadeID = atividadeAtualizada._id;
                AtividadeQuestao.deleteMany({ atividadeID: atividadeID });
            }

            // Insere todas as QuestoesAtividade novas
            let atividadeID = atividadeEncontrada._id;
            let qaID, arrayQuestoes = [];
            
            questoesAtualizadas.forEach(questaoID => {
                qaID = mongoose.Types.ObjectId();
                arrayQuestoes.push(qaID);
                inserirAtividadeQuestao(qaID, questaoID, atividadeID);
            })

            // Atualiza QAs
            atividadeEncontrada.questoes = arrayQuestoes;
        }

        // Caso a selecão atualizada de questões seja vazia
        else {
            // Remove todas as AtividadeQuestoes antes de atualizar
            AtividadeQuestao.deleteMany({ atividadeID: req.params.id });
            atividadeEncontrada.questoes = atividadeAtualizada.questoes
        }

        if (err) {
            return res
                .status(404)
                .json({
                    err, 
                    message: "Atividade não encontrada."
                })
        }

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

            // Remove antes todas as AtividadeQuestoes
            AtividadeQuestao.deleteMany({ atividadeID: req.params.id });

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
        .findOne({ _id: req.params.id })
        .populate({ path: 'questoes', select: 'questaoID'})
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

// Retorna as questões de certa atividade especificada pelo ID
encQuestoesDaAtividadeID = async (req, res) => {
    // Encontra questões por AtividadeID fornecido na rota
    await AtividadeQuestao
        .find({ atividadeID: req.params.id })
        .populate("questaoID")
        .exec((err, questoesEncontradas) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!questoesEncontradas) {
                return res
                    .status(404)
                    .json({success: false, error: "Atividade não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: questoesEncontradas})
        });
}

// Retorna redação da semana
encRedacaoDaSemana = async (req, res) => {
    // Recebe numeracao === topicoID.numeracao
    const populateQuery = {
        path: 'topicoID',
        select: 'numeracao',
        match: {
            numeracao: req.params.numeracao
        }
    };

    await Atividade
        .find({ tipoAtividade: 'Redação' })
        .populate('disciplinaID')
        .populate(populateQuery)
        .exec((err, redacaoEncontrada) => {
                // Remove dados cuja numeração não condiz com a buscada e, portanto, são nulos
                redacaoEncontrada = redacaoEncontrada.filter(redacao => {
                    return redacao.topicoID;
                });

                // Erro
                if (err) {
                    return res.status(400).json({success: false, error: err})
                }
                
                // Nada encontrado
                if (!redacaoEncontrada) {
                    return res.status(404).json({success: false, error: "Conteúdo não encontrado."})
                }

                // Dados encontrados com sucesso
                return res.status(200).json({success: true, data: redacaoEncontrada})
            })
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
    await Atividade
        .find({ "topicoID": req.params.id })
        .populate('disciplinaID', 'nome')
        .populate('topicoID', 'topico')
        .populate('questoes')
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
    encQuestoesDaAtividadeID,
    encRedacaoDaSemana,
    listarAtividade,
    listarAtividadesPorTopico
}
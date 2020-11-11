const Questao = require('../models/question-model');
const TagQuestao = require('../models/tagQuestion-model');
const mongoose = require('mongoose');

// ======================================
// FUNÇÕES DE TAG-QUESTÃO
// ======================================

// Função para inserir tagQuestao no banco
inserirTagQuestao = async (tag, questao, tqID) => {
    const body = { _id: tqID, tagID: tag, questaoID: questao };
    const novaTagQuestao = new TagQuestao(body);
    await novaTagQuestao.save();
}

// Função para remover tagQuestao no banco
removerTagQuestao = (tqID) => {
    TagQuestao.findOneAndDelete({ _id: tqID}, err => {
            if (err) {
                console.log(err);
                return false;
            }
            return true;
        })
        .catch(err => console.log(err))
}

// ======================================
// FUNÇÕES DE QUESTÃO
// ======================================

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

    let novaQuestao = new Questao(body);

    // Verifica se dados não são nulos
    if (!novaQuestao) {
        console.log("Erro - nova questão")
        return res
            .status(400)
            .json({
                success: false, 
                error: err
            });
    }

    novaQuestao._id = mongoose.Types.ObjectId();
    
    // Inserir QuestaoTag
    if (novaQuestao.tags.length > 0) {
        let tqID, arrayTags = [];
        // Insere as TQs
        novaQuestao.tags.map(tagID => {
            tqID = mongoose.Types.ObjectId();
            arrayTags.push(tqID);
            inserirTagQuestao(tagID, novaQuestao._id, tqID);
        })
        novaQuestao.tags = arrayTags;
    }
    
    // Salva nova questão
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
            console.log(error)
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
        questaoEncontrada.disciplinaID = questaoAtualizada.disciplinaID
        questaoEncontrada.topicoID = questaoAtualizada.topicoID
        questaoEncontrada.enunciado = questaoAtualizada.enunciado
        questaoEncontrada.tipoResposta = questaoAtualizada.tipoResposta
        questaoEncontrada.resposta = questaoAtualizada.resposta
        questaoEncontrada.dataEdicao = questaoAtualizada.dataEdicao
        questaoEncontrada.padraoResposta = questaoAtualizada.padraoResposta
        
        // Verificação de Tags
        let tagsAntigas = questaoEncontrada.tags;
        let tagsAtualizadas = questaoAtualizada.tags;

        // Caso ambas as versões possuam tags
        if (tagsAtualizadas.length) {
            // Remove todas as TagQuestao antigas
            if (tagsAntigas.length) {
                TagQuestao.deleteMany({ questaoID: req.params.id })
            }

            // Insere todas as TagQuestao novas
            let questaoID = questaoEncontrada._id;
            let tqID, arrayTags = [];
            
            tagsAtualizadas.forEach(tagID => {
                tqID = mongoose.Types.ObjectId();
                arrayTags.push(tqID);
                inserirTagQuestao(tagID, questaoID, tqID);
            })

            // Atualiza TQs
            questaoEncontrada.tags = arrayTags;
        } 
        
        // Caso a selecão atualizada de tags seja vazia
        else {
            // Apaga todas as TagQuestoes antes de atualizar valor
            TagQuestao.deleteMany({ questaoID: req.params.id })
            questaoEncontrada.tags = questaoAtualizada.tags
        }

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
                console.log (err);
                return res
                    .status(400)
                    .json({
                        success: false, 
                        error: err
                    })
            }
            
            // Caso não encontre nenhuma questão
            if (!questaoEncontrada) {
                return res
                    .status(404)
                    .json({
                        success: false, 
                        error: "Questao não encontrado."
                    })
            }

            // Remove QuestaoTag antes de remover a questão
            TagQuestao.deleteMany({ questaoID: req.params.id })

            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({
                    success: true, 
                    data: questaoEncontrada
                })
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
    await Questao.find()
    .populate('disciplinaID', 'nome')
    .populate('topicoID', 'topico')
    .populate({ path: 'tags', select: 'tagID', populate: { path: 'tagID' } })
    .sort({ 'disciplinaID.nome': 1 })
    .exec(function (err, listaQuestao) {
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
    });
}

// Função para listar os questaos contidos no banco
listarQuestaoPorTopico = async (req, res) => {
    await Questao.find({ 'topicoID': req.params.id })
        .populate('disciplinaID', 'nome')
        .populate('topicoID', 'topico')
        .populate({ path: 'tags', select: 'tagID', populate: { path: 'tagID' } })
        .exec((err, listaQuestao) => {
            // Verificação de erros
            if (err) {
                return res.status(400).json({ 
                    success: false, 
                    error: err 
                })
            }

            // Verifica se há dados na lista
            if (!listaQuestao.length) {
                return res
                    .status(404)
                    .json({ 
                        success: false, 
                        error: "Dados não encontrados." 
                    })
            }

            // Caso não haja erros, retorna lista de questaos
            return res
                .status(200)
                .json({ 
                    success: true, 
                    data: listaQuestao 
                })
        })
}

// Função para listar os questaos contidos no banco
listarQuestaoPorArea = async (req, res) => {
    await Questao.find()
    .populate('topicoID', 'topico')
    .populate({ path: 'tags', select: 'tagID', populate: { path: 'tagID' }})
    .populate({ path: 'disciplinaID', match: { 'areaConhecimento': req.params.area }})
    .exec((err, listaQuestao) => {

        // Verificação de erros
        if (err) {
            return res.status(400).json({ 
                success: false, 
                error: err 
            })
        }
        // Verifica se há dados na lista
        if (!listaQuestao.length) {
            return res
                .status(404)
                .json({ 
                    success: false, 
                    error: "Dados não encontrados." 
                })
        }

        // Retorna somente as questões pertencentes à área do conhecimento escolhida
        listaQuestao = listaQuestao.filter(function(questao) {
            return questao.disciplinaID;
        });

        // Caso não haja erros, retorna lista de questaos
        return res.status(200).json({ success: true, data: listaQuestao })
    });
}

// Função para listar os questaos contidos no banco
listarQuestaoPorTopico = async (req, res) => {
    await Questao.find({ 'topicoID': req.params.id })
        .populate('disciplinaID', 'nome')
        .populate('topicoID', 'topico')
        .populate({ path: 'tags', select: 'tagID', populate: { path: 'tagID' } })
        .exec((err, listaQuestao) => {
            // Verificação de erros
            if (err) {
                return res.status(400).json({ 
                    success: false, 
                    error: err 
                })
            }

            // Verifica se há dados na lista
            if (!listaQuestao.length) {
                return res
                    .status(404)
                    .json({ 
                        success: false, 
                        error: "Dados não encontrados." 
                    })
            }

            // Caso não haja erros, retorna lista de questaos
            return res
                .status(200)
                .json({ 
                    success: true, 
                    data: listaQuestao 
                })
        })
}

// Função para listar TQ por QuestaoID
listarTQPorQuestaoID = async (req, res) => {
    await TagQuestao
        .find({ questaoID: req.params.id }, 
            (err, tagQuestaoEncontrada) => {
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

// Função para listar questões por disciplina
listarQuestaoPorDisciplina = async (req, res) => {
    var populateQuery = {
        path: 'disciplinaID',
        select: 'nome',
        match: { _id: req.params.id }
    };

    await Questao.find()
    .populate(populateQuery)
    .populate('topicoID', 'topico')
    .populate({ path: 'tags', select: 'tagID', populate: { path: 'tagID' } })
    .sort({ 'disciplinaID.nome': 1 })
    .exec(function (err, listaQuestao) {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        listaQuestao = listaQuestao.filter(function(item) {
            return item.disciplinaID;
        });

        // Verifica se há dados na lista
        if (!listaQuestao.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de questaos
        return res.status(200).json({ success: true, data: listaQuestao })
    });
}

// Exporta os módulos
module.exports = {
    inserirQuestao,
    atualizarQuestao,
    removerQuestao,
    encQuestaoPorID,
    listarQuestao,
    listarQuestaoPorTopico,
    listarQuestaoPorArea,
    listarTQPorQuestaoID,
    listarQuestaoPorDisciplina
}
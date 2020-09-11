const TagQuestaoCtrl = require("../controllers/tag&question-ctrl");
const Questao = require('../models/question-model');
const mongoose = require('mongoose');

const TagQuestao = require('../models/tag&question-model');

// Função para inserir tagQuestao no banco
inserirTagQuestao = (tag, questao) => {
    const body = { tagID: tag, questaoID: questao };
    const novaTagQuestao = new TagQuestao(body);
    return novaTagQuestao.save();
}

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

    // Inserir QuestaoTag
    if (novaQuestao.tags.length > 0) {
        novaQuestao._id = mongoose.Types.ObjectId();
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
        questaoEncontrada.padraoResposta = questaoAtualizada.padraoResposta
        
        if (questaoEncontrada.tags === questaoAtualizada.tags) {
            questaoEncontrada.tags = questaoAtualizada.tags
        } else {
            let differentTags = questaoAtualizada.tags.filter(newTag => {
                return questaoAtualizada.tags !== questaoEncontrada.tags;
            })

        }

        console.log(questaoEncontrada)

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
            
            console.log (questaoEncontrada);

            // Caso não encontre nenhuma questão
            if (!questaoEncontrada) {
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

// Função para listar os questaos contidos no banco
listarQuestaoPorTopico = async (req, res) => {
    await Questao.find({
        'topico.id': req.params.id,
    }, (err, listaQuestao) => {
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
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Função para listar os questaos contidos no banco
listarQuestaoPorArea = async (req, res) => {
    await Questao.aggregate([
        {
            $lookup: {
                from: "disciplinas",
                localField: "disciplina.id",
                foreignField: "_id",
                as:"disciplinaInfo"
            }
        },
        {
            $match : {
                "disciplinaInfo.areaConhecimento": req.params.area
            }
        },
    ], (err, listaQuestao) => {
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
    listarQuestao,
    listarQuestaoPorTopico,
    listarQuestaoPorArea
}
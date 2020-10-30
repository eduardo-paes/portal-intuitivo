const RespostaAluno = require('../models/studentAnswer-model');

// Função para inserir RespostaAluno no banco
inserirRespostaAluno = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;
    
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A resposta do aluno deve ser fornecida.",
        })
    }
    
    const novaRespostaAluno = new RespostaAluno(body);

    // Verifica se dados não são nulos
    if (!novaRespostaAluno) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    //Salva novaRespostaAluno
    novaRespostaAluno
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaRespostaAluno._id,
                message: "Resposta do aluno inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "Resposta do aluno não inserida.",
            })
        });
}

// Função para atualizar resposta do aluno por ID
atualizarRespostaAluno = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;
    
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }
    
    const respostaAlunoAtualizada = new RespostaAluno(body);

    // Verifica se dados não são nulos
    if (!respostaAlunoAtualizada) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca a resposta do aluno pelo id (id da rota)
    RespostaAluno.findOne({
        _id: req.params.id
    }, (err, respostaAlunoEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({
                    err, 
                    message: "Resposta do aluno não encontrada."
                })
        }

        // Atualiza dados da resposta do aluno encontrada
        respostaAlunoEncontrada.alunoID = respostaAlunoAtualizada.alunoID
        respostaAlunoEncontrada.atividadeID = respostaAlunoAtualizada.atividadeID
        respostaAlunoEncontrada.revisaoID = respostaAlunoAtualizada.revisaoID
        respostaAlunoEncontrada.respostaQuestaoIDs = respostaAlunoAtualizada.respostaQuestaoIDs
        respostaAlunoEncontrada.corrigido = respostaAlunoAtualizada.corrigido
        respostaAlunoEncontrada.nota = respostaAlunoAtualizada.nota

        // Salva alterações
        respostaAlunoEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: respostaAlunoEncontrada._id,
                    message:"Resposta do aluno atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Resposta do aluno não atualizada.",
                })
            });
    });
}

// Função para remover respostaAluno por ID
removerRespostaAluno = async (req, res) => {
    // Encontra respostaQuestao pelo ID e remove
    await RespostaAluno
        .findOneAndDelete({
            _id: req.params.id
        }, (err, respostaAlunoEncontrada) => {


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
            if (!respostaAlunoEncontrada) {
                return res
                    .status(404)
                    .json({
                        success: false, 
                        error: "Resposta aluno não encontrada."
                    })
            }

            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({
                    success: true, 
                    data: respostaAlunoEncontrada
                })
        })
        .catch(err => console.log(err))
}

// Função para buscar resposta do aluno pelo id do aluno e da atividade
encRespostaAluno = async (req, res) => {
    // Encontra resposta do aluno pelo id do aluno e da atividade fornecidos na rota
    await RespostaAluno
        .findOne({
            alunoID: req.params.alunoID,
            revisaoID: req.params.revisaoID
        }, (err, respostaAlunoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!respostaAlunoEncontrada) {
                return res
                    .json({success: false, error: "Resposta do aluno não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaAlunoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para buscar resposta do aluno por ID
encRespostaAlunoPorID = async (req, res) => {
    // Encontra resposta do aluno por ID fornecido na rota
    await RespostaAluno
        .findOne({
            _id: req.params.id
        }, (err, respostaAlunoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!respostaAlunoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Resposta do aluno não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaAlunoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar respostaAluno contidos no banco
listarRespostaAluno = async (req, res) => {
    await RespostaAluno.find({})
    .exec(function (err, listaRespostaAluno) {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaRespostaAluno.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de respostaAluno
        return res.status(200).json({ success: true, data: listaRespostaAluno })
    });
}

// Função para listar TQ por QuestaoID
listarRAPorRespostaQuestaoID = async (req, res) => {
    await RespostaAluno
        .find({ respostaQuestaoIDs: req.params.id }, 
            (err, respostaAlunoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!respostaAlunoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Resposta do aluno não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaAlunoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar TQ por TagID
listarRAPorAlunoID = async (req, res) => {
    await RespostaAluno
        .find({ alunoID: req.params.id }, 
            (err, respostaAlunoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!respostaAlunoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Resposta do aluno não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaAlunoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar RA por AtividadeID
listarRAPorAtividadeID = async (req, res) => {
    const populateQuery = {
        path: 'atividadeID', 
        select: ['questoes', 'tipoAtividade'], 
        populate: {
            path: 'questoes',
            populate: 'questaoID'
        }
    }
    await RespostaAluno
        .find({ atividadeID: req.params.atividadeID })
        .populate({path: 'alunoID', select: 'nome'})
        .populate(populateQuery)
        .populate({path: 'respostaQuestaoIDs', select: ['nota', 'resposta', 'comentario', 'corrigido']})
        .exec((err, respostaAlunoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!respostaAlunoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Resposta do aluno não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaAlunoEncontrada})
        })
}

listarRespostaAlunoPorDisciplina = async (req, res) => {
    const { disciplina } = req.params;
    let array = [];

    const populateQuery = {
        path: 'atividadeID',
        populate: {
            path: 'topicoID',
            select: ['topico','numeracao', 'disciplinaID'],
            populate: {
                path: 'disciplinaID',
                select: 'nome',
                match: {
                    _id: disciplina
                }
            }
        }
    };
    
    await RespostaAluno
            .find({  })
            .populate('respostaQuestaoIDs')
            .populate(populateQuery)
            .exec((err, respostaAlunoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }
            
            respostaAlunoEncontrada = respostaAlunoEncontrada.filter(function(item) {
                if (!array.find(element => element === item.atividadeID._id)) {
                    array.push(item.atividadeID._id);
                    return item.atividadeID.topicoID.disciplinaID;
                }    
            });

            if (respostaAlunoEncontrada.length === 0) {
                return res
                    .status(404)
                    .json({success: false, error: "Resposta do aluno não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: respostaAlunoEncontrada})
        })
}

// Exporta os módulos
module.exports = {
    inserirRespostaAluno,
    atualizarRespostaAluno,
    removerRespostaAluno,
    encRespostaAlunoPorID,
    listarRespostaAluno,
    listarRAPorAtividadeID,
    listarRAPorRespostaQuestaoID,
    listarRAPorAlunoID,
    listarRespostaAlunoPorDisciplina
}
const RespostaAluno = require('../models/studentAnswer-model');
const RespostaQuestao = require('../models/answerQuestion-model');

inserirRespostaQuestao = async (rqID, questao, aluno, resposta, nota) => {
    const body = { _id: rqID, questaoID: questao, alunoID: aluno, resposta: resposta, nota: nota };
    console.log(body);
    const novaRespostaQuestao = new RespostaQuestao(body);
    await novaRespostaQuestao.save();
}

// Função para remover tagQuestao no banco
removerRespostaQuestao = (rqID) => {
    RespostaQuestao.findOneAndDelete({ _id: rqID}, err => {
            if (err) {
                console.log(err);
                return false;
            }
            return true;
        })
        .catch(err => console.log(err))
}

// Função para inserir RespostaAluno no banco
inserirRespostaAluno = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    console.log(req.body)

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

    console.log(novaRespostaAluno);
    // Inserir respostaQuestao
    if (novaRespostaAluno.respostaQuestaoID.length > 0) {
        let rqID, rqIDs = [];
        // Insere as TQs
        novaRespostaAluno.respostaQuestaoID.map(row => {
            rqID = mongoose.Types.ObjectId();
            rqIDs.push(rqID);
            inserirTagQuestao(rqID, row.questaoID, row.alunoID, row.resposta, row.nota);
        })
        novaRespostaAluno.respostaQuestaoID = rqIDs;
    }

    // Salva nova respostaAluno
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

// Função para buscar tagQuestao por ID
encRespostaAlunoPorID = async (req, res) => {
    // Encontra tagQuestao por ID fornecido na rota
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
        .find({ respostaQuestaoID: req.params.id }, 
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

// Exporta os módulos
module.exports = {
    inserirRespostaAluno,
    removerRespostaAluno,
    encRespostaAlunoPorID,
    listarRespostaAluno,
    listarRAPorRespostaQuestaoID,
    listarRAPorAlunoID
}
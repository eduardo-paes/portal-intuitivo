const ProgressoTopico = require('../models/progressTopic-model');
const ProgressoRedacao = require('../models/progressEssay-model');
const ProgressoRevisao = require('../models/progressRevision-model');
const { populate } = require('../models/progressTopic-model');

// ================================================
// PROGRESSO RELACIONADO AO TÓPICO
// ================================================

// Função de Inserção
inserirProgresso = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Um usuário deve ser fornecido.",
        })
    }

    const novoProgresso = new ProgressoTopico(body);

    // Verifica se dados não são nulos
    if (!novoProgresso) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva no banco
    novoProgresso
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novoProgresso._id,
                message: "Progresso inserido com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                error,
                message: "Progresso não inserido!",
            })
        });
}

// Função de atualização
atualizarProgresso = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const progresso = new ProgressoTopico(body);

    // Verifica se dados não são nulos
    if (!progresso) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca por id
    ProgressoTopico.findOne({
        _id: req.params.id
    }, (err, progressoEncontrado) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "Progresso não encontrado."})
        }

        // Atualiza dados encontrados
        progressoEncontrado.progresso = progresso.progresso

        // Salva alterações
        progressoEncontrado
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: progressoEncontrado._id,
                    message:"Progresso atualizado com sucesso!",
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(404).json({
                    success: false,
                    error,
                    message: "Progresso não atualizado!",
                })
            });
    });
}

// Função de remoção
removerProgresso = async (req, res) => {
    // Encontra usuário pelo ID e remove
    await ProgressoTopico
        .findOneAndDelete({
            _id: req.params.id
        }, (err, progressoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar por ID
encProgressoPorID = async (req, res) => {
    await ProgressoTopico
        .findOne({
            _id: req.params.id
        }, (err, progressoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar por ID
encProgressoPorTopico = async (req, res) => {
    await ProgressoTopico
        .findOne({
            alunoID: req.params.alunoID,
            topicoID: req.params.topicoID
        }, (err, progressoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para listar os usuários contidos no banco
listarProgressoPorAluno = async (req, res) => {
    await ProgressoTopico
        .find({
            alunoID: req.params.id
        }, (err, progressosEncontrados) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressosEncontrados) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: progressosEncontrados})
        })
        .catch(err => console.log(err))
}

// ================================================
// PROGRESSO RELACIONADO À REDAÇÃO
// ================================================

// Função de Inserção
inserirProgressoRedacao = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Um usuário deve ser fornecido.",
        })
    }

    const novoProgresso = new ProgressoRedacao(body);

    // Verifica se dados não são nulos
    if (!novoProgresso) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva no banco
    novoProgresso
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novoProgresso._id,
                message: "Progresso inserido com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                error,
                message: "Progresso não inserido!",
            })
        });
}

// Função de atualização
atualizarProgressoRedacao = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const progresso = new ProgressoRedacao(body);

    // Verifica se dados não são nulos
    if (!progresso) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca por id
    ProgressoRedacao.findOne({
        _id: req.params.id
    }, (err, progressoEncontrado) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "Progresso não encontrado."})
        }

        // Atualiza dados encontrados
        progressoEncontrado.progresso = progresso.progresso
        progressoEncontrado.corrigido = progresso.corrigido
        progressoEncontrado.nota = progresso.nota

        // Salva alterações
        progressoEncontrado
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: progressoEncontrado._id,
                    message:"Progresso atualizado com sucesso!",
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(404).json({
                    success: false,
                    error,
                    message: "Progresso não atualizado!",
                })
            });
    });
}

// Função de remoção
removerProgressoRedacao = async (req, res) => {
    await ProgressoRedacao
        .findOneAndDelete({
            _id: req.params.id
        }, (err, progressoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar por ID
encProgressoRedacaoPorID = async (req, res) => {
    await ProgressoRedacao
        .findOne({
            _id: req.params.id
        }, (err, progressoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar por ID
encProgressoPorRedacaoID = async (req, res) => {
    await ProgressoRedacao
        .findOne({
            alunoID: req.params.alunoID,
            redacaoID: req.params.redacaoID
        }, (err, progressoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

listarRedacoesNaoCorrigidas = async (req, res) => {
    const { disciplina } = req.params;

    const populateQuery = {
        path: 'redacaoID',
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
        },
    };

    await ProgressoRedacao
        .find({corrigido: false})
        .populate({path: 'alunoID', select: 'nome'})
        .populate(populateQuery)
        .exec((err, listaRedacoes) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            listaRedacoes = listaRedacoes.filter(function(item) {
                return item.redacaoID.topicoID.disciplinaID;
            });

            if (listaRedacoes.length === 0) {
                return res
                    .status(404)
                    .json({success: false, error: "Redações não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: listaRedacoes})
        });
}

listarRedacoesNaoCorrigidasPorRedacaoID = async (req, res) => {
    const { redacaoID } = req.params;

    const populateQuery = {
        path: 'alunoID', select: 'nome'
    }

    await ProgressoRedacao
        .find({
            corrigido: false
        })
        .populate(populateQuery)
        .exec((err, listaRedacoes) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (listaRedacoes.length === 0) {
                return res
                    .status(404)
                    .json({success: false, error: "Redações não encontrada."})
            }

            listaRedacoes.filter(item => {
                return item._id === redacaoID;
            });

            return res
                .status(200)
                .json({success: true, data: listaRedacoes})
        });
}

contarRedacoesNaoCorrigidas = async (req, res) => {
    const { disciplina } = req.params;

    const populateQuery = {
        path: 'redacaoID',
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
        },
    };

    await ProgressoRedacao
        .countDocuments({ corrigido: false })
        .populate(populateQuery)
        .exec((err, contagem) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            return res
                .status(200)
                .json({success: true, data: contagem})
        });
}


// ================================================
// PROGRESSO RELACIONADO À REVISÃO
// ================================================

// Função de Inserção
inserirProgressoRevisao = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    console.log(body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Um usuário deve ser fornecido.",
        })
    }

    const novoProgresso = new ProgressoRevisao(body);
    console.log(novoProgresso)

    // Verifica se dados não são nulos
    if (!novoProgresso) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva no banco
    novoProgresso
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novoProgresso._id,
                message: "Progresso inserido com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                error,
                message: "Progresso não inserido!",
            })
        });
}

// Função de atualização
atualizarProgressoRevisao = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const progresso = new ProgressoRevisao(body);

    // Verifica se dados não são nulos
    if (!progresso) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca por id
    ProgressoRevisao.findOne({
        _id: req.params.id
    }, (err, progressoEncontrado) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "Progresso não encontrado."})
        }

        // Atualiza dados encontrados
        progressoEncontrado.progresso = progresso.progresso

        // Salva alterações
        progressoEncontrado
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: progressoEncontrado._id,
                    message:"Progresso atualizado com sucesso!",
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(404).json({
                    success: false,
                    error,
                    message: "Progresso não atualizado!",
                })
            });
    });
}

// Função de remoção
removerProgressoRevisao = async (req, res) => {
    await ProgressoRevisao
        .findOneAndDelete({
            _id: req.params.id
        }, (err, progressoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar por ID
encProgressoRevisaoPorID = async (req, res) => {
    await ProgressoRevisao
        .findOne({
            _id: req.params.id
        }, (err, progressoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar por ID
encProgressoPorRevisaoID = async (req, res) => {
    await ProgressoRevisao
        .findOne({
            alunoID: req.params.alunoID,
            revisaoID: req.params.revisaoID
        }, (err, progressoEncontrado) => {
            
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!progressoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Progresso não encontrado."})
            }

            console.log(progressoEncontrado);

            return res
                .status(200)
                .json({success: true, data: progressoEncontrado})
        })
        .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    // Atividade
    inserirProgresso,
    atualizarProgresso,
    removerProgresso,
    encProgressoPorID,
    encProgressoPorTopico,
    listarProgressoPorAluno,
    // Redação
    inserirProgressoRedacao,
    atualizarProgressoRedacao,
    removerProgressoRedacao,
    encProgressoRedacaoPorID,
    encProgressoPorRedacaoID,
    listarRedacoesNaoCorrigidas,
    listarRedacoesNaoCorrigidasPorRedacaoID,
    contarRedacoesNaoCorrigidas,
    // Revisão
    inserirProgressoRevisao,
    atualizarProgressoRevisao,
    removerProgressoRevisao,
    encProgressoRevisaoPorID,
    encProgressoPorRevisaoID,
}
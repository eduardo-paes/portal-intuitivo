const Conteudo = require('../models/content-model');
const Atividade = require('../models/activity-model')
const Questao = require('../models/question-model')

// Função para inserir conteúdo no banco
inserirConteudo = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "O conteúdo deve ser fornecido.",
        })
    }
    
    const novoConteudo = new Conteudo(body);

    // Verifica se dados não são nulos
    if (!novoConteudo) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva novo usário
    novoConteudo
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novoConteudo._id,
                message: "Conteúdo inserido com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "Conteúdo não inserido!",
            })
        });
}

// Função para atualizar conteúdo por ID
atualizarConteudo = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }
    
    const conteudo = new Conteudo(body);

    // Verifica se dados não são nulos
    if (!conteudo) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    
    // Busca conteúdo pelo id (id da rota)
    Conteudo.findOne({
        _id: req.params.id
    }, (err, conteudoEncontrado) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "Conteúdo não encontrado."})
        }
        
        // Atualiza dados do conteúdo encontrado
        conteudoEncontrado.topico = conteudo.topico
        conteudoEncontrado.disciplinaID = conteudo.disciplinaID
        conteudoEncontrado.numeracao = conteudo.numeracao
        conteudoEncontrado.autor = conteudo.autor

        // Salva alterações
        conteudoEncontrado
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: conteudoEncontrado._id,
                    message:"Conteúdo atualizado com sucesso!",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Conteúdo não atualizado!",
                })
            });
    });
}

// Função para remover conteúdo por ID
removerConteudo = async (req, res) => {
    // Encontra conteúdo pelo ID e remove
    await Conteudo
        .findOneAndDelete({
            _id: req.params.id
        }, (err, conteudoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!conteudoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Conteúdo não encontrado."})
            }

            Atividade.remove({topicoID: req.params.id}).exec();
            Questao.remove({topicoID: req.params.id}).exec();

            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: conteudoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar conteúdo por ID
encConteudoPorID = async (req, res) => {
    // Encontra conteúdo por ID fornecido na rota
    await Conteudo
        .findOne({
            _id: req.params.id
        }, (err, conteudoEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!conteudoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Conteúdo não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: conteudoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar conteúdo por ID da Disciplina
listarConteudoPorDisciplina = async (req, res) => {
    // Encontra conteúdo pela ID da Disciplina fornecido pela rota
    await Conteudo
        .find({
            'disciplinaID': req.params.id,
        }, (err, conteudoEncontrado) => {

            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!conteudoEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Conteúdo não encontrado."})
            }

            return res
                .status(200)
                .json({success: true, data: conteudoEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para listar conteúdo utilizando filtro
listarConteudoPersonalizado = async (req, res) => {
    // Encontra conteúdo pela ID da Disciplina fornecido pela rota
    let flag = 0;
    let paramsNumeracao = [];

    if (req.params.numeracao) {
        paramsNumeracao[0] = req.params.numeracao;
    } else {
        for (let i = 1; i < 33; ++i) {
            paramsNumeracao[i-1] = i;
        }
    }

    if (req.params.id === '000000000000000000000000') {
        if (req.params.area === 'area') flag = 1;
        else flag = 2;
    } else {
        if (req.params.area === 'area') flag = 3;
        else flag = 4;
    }

    if (flag === 1) {
        await Conteudo
        .find({ 
            'disciplina.id': { $gte: req.params.id },
            area: { $ne: req.params.area },
            numeracao: { $in: paramsNumeracao }
        }, (err, conteudoEncontrado) => {
            if (err) {
                return res
                .status(400)
                .json({success: false, error: err})
            }
            
            if (!conteudoEncontrado) {
                return res
                .status(404)
                .json({success: false, error: "Conteúdo não encontrado."})
            }
            
            return res
            .status(200)
            .json({success: true, data: conteudoEncontrado})
            })
            .catch(err => console.log(err))
    } 
    
    else if (flag === 2) {
        await Conteudo
        .find({ 
            'disciplina.id': { $gte: req.params.id },
            area: { $eq: req.params.area },
            numeracao: { $in: paramsNumeracao }
        
        }, (err, conteudoEncontrado) => {
            if (err) {
                return res
                .status(400)
                .json({success: false, error: err})
            }
            
            if (!conteudoEncontrado) {
                return res
                .status(404)
                .json({success: false, error: "Conteúdo não encontrado."})
            }
            
            return res
            .status(200)
            .json({success: true, data: conteudoEncontrado})
            })
            .catch(err => console.log(err))
    } 
    
    else if (flag === 3) {
        await Conteudo
        .find({ 
            'disciplina.id': { $eq: req.params.id },
            area: { $ne: req.params.area },
            numeracao: { $in: paramsNumeracao }
        
        }, (err, conteudoEncontrado) => {
            if (err) {
                return res
                .status(400)
                .json({success: false, error: err})
            }
            
            if (!conteudoEncontrado) {
                return res
                .status(404)
                .json({success: false, error: "Conteúdo não encontrado."})
            }
            
            return res
            .status(200)
            .json({success: true, data: conteudoEncontrado})
            })
            .catch(err => console.log(err))
    } 
    
    else if (flag === 4) {
        await Conteudo
        .find({ 
            'disciplina.id': { $eq: req.params.id },
            area: { $eq: req.params.area },
            numeracao: { $in: paramsNumeracao }
        
        }, (err, conteudoEncontrado) => {
            if (err) {
                return res
                .status(400)
                .json({success: false, error: err})
            }
            
            if (!conteudoEncontrado) {
                return res
                .status(404)
                .json({success: false, error: "Conteúdo não encontrado."})
            }
            
            return res
            .status(200)
            .json({success: true, data: conteudoEncontrado})
            })
            .catch(err => console.log(err))
    }
        
}

// Função para listar os conteúdos contidos no banco
listarConteudos = async (req, res) => {
    await Conteudo.find({})
        .populate('disciplinaID')
        .exec((err, listaConteudos) => {
            // Verifica se os dados foram encontrados
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            // Verifica se há dados na lista
            if (!listaConteudos.length) {
                return res
                    .status(404)
                    .json({ success: false, error: "Dados não encontrados." })
            }
            // Caso não haja erros, retorna lista de conteúdos
            return res.status(200).json({ success: true, data: listaConteudos })
        })
}

// Exporta os módulos
module.exports = {
    inserirConteudo,
    atualizarConteudo,
    removerConteudo,
    encConteudoPorID,
    listarConteudos,
    listarConteudoPorDisciplina,
    listarConteudoPersonalizado
}
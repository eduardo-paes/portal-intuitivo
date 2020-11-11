const AnoLetivo = require('../models/schoolYear-model');

// Função para inserir anoLetivo no banco
inserirAnoLetivo = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "O Ano Letivo deve ser fornecida.",
        })
    }

    const novaAnoLetivo = new AnoLetivo(body);

    // Verifica se dados não são nulos
    if (!novaAnoLetivo) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva novo anoLetivo
    novaAnoLetivo
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaAnoLetivo._id,
                message: "AnoLetivo inserido com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "AnoLetivo não inserido.",
            })
        });
}

// Função para atualizar anoLetivo por ID
atualizarAnoLetivo = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const anoLetivo = new AnoLetivo(body);

    // Verifica se dados não são nulos
    if (!anoLetivo) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca Ano Letivo pelo id (id da rota)
    AnoLetivo.findOne({
        _id: req.params.id
    }, (err, anoLetivoEncontrada) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "AnoLetivo não encontrada."})
        }

        // Atualiza dados do anoLetivo encontrada
        anoLetivoEncontrada.dataInicio = anoLetivo.dataInicio
        anoLetivoEncontrada.dataFim = anoLetivo.dataFim
        anoLetivoEncontrada.contagem = anoLetivo.contagem
        anoLetivoEncontrada.numSemanas = anoLetivo.numSemanas

        // Salva alterações
        anoLetivoEncontrada
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: anoLetivoEncontrada._id,
                    message:"AnoLetivo atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "AnoLetivo não atualizada.",
                })
            });
    });
}

// Função para remover anoLetivo por ID
removerAnoLetivo = async (req, res) => {
    // Encontra anoLetivo pelo ID e remove
    await AnoLetivo
        .findOneAndDelete({
            _id: req.params.id
        }, (err, anoLetivoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!anoLetivoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "Ano Letivo não encontrada."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: anoLetivoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para buscar anoLetivo por ID
encAnoLetivoPorID = async (req, res) => {
    // Encontra anoLetivo por ID fornecido na rota
    await AnoLetivo
        .findOne({
            _id: req.params.id
        }, (err, anoLetivoEncontrada) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!anoLetivoEncontrada) {
                return res
                    .status(404)
                    .json({success: false, error: "AnoLetivo não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: anoLetivoEncontrada})
        })
        .catch(err => console.log(err))
}

// Função para listar os anoLetivos contidos no banco
listarAnoLetivo = async (req, res) => {
    await AnoLetivo
        .find()
        .limit(1)
        .exec(function (err, listaAnoLetivo) {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaAnoLetivo.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna ano letivo
        return res.status(200).json({ success: true, data: listaAnoLetivo })
    })
}

// Exporta os módulos
module.exports = {
    inserirAnoLetivo,
    atualizarAnoLetivo,
    removerAnoLetivo,
    encAnoLetivoPorID,
    listarAnoLetivo
}
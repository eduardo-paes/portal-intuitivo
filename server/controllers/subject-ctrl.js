const Disciplina = require('../models/subject-model');

// Função para inserir disciplina no banco
inserirDisciplina = (req, res) => {
    // Recebe dados do formulário
    const body = req.body;
    console.log(req.body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "A disciplina deve ser fornecida.",
        })
    }

    const novaDisciplina = new Disciplina(body);

    // Verifica se dados não são nulos
    if (!novaDisciplina) {
        return res
            .status(400)
            .json({success: false, error: err});
    }

    // Salva novo usário
    novaDisciplina
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: novaDisciplina._id,
                message: "Disciplina inserida com sucesso!",
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: "Disciplina não inserida.",
            })
        });
}

// Função para atualizar disciplina por ID
atualizarDisciplina = async (req, res) => {
    // Recebe dados do formulário
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Os dados devem ser fornecidos.",
        })
    }

    const disciplina = new Disciplina(body);

    // Verifica se dados não são nulos
    if (!disciplina) {
        return res
            .status(400)
            .json({success: false, error: "Os dados são nulos ou incompatíveis."})
    }

    // Busca disciplina pelo id (id da rota)
    Disciplina.findOne({
        _id: req.params.id
    }, (err, disciplinaEncontrado) => {
        if (err) {
            return res
                .status(404)
                .json({err, message: "Disciplina não encontrada."})
        }

        // Atualiza dados do disciplina encontrado
        disciplinaEncontrado.nome = disciplina.nome
        disciplinaEncontrado.diaSemana = disciplina.diaSemana

        // Salva alterações
        disciplinaEncontrado
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: disciplinaEncontrado._id,
                    message:"Disciplina atualizada com sucesso.",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Disciplina não atualizada.",
                })
            });
    });
}

// Função para remover disciplina por ID
removerDisciplina = async (req, res) => {
    // Encontra disciplina pelo ID e remove
    await Disciplina
        .findOneAndDelete({
            _id: req.params.id
        }, (err, disciplinaEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!disciplinaEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Disciplina não encontrado."})
            }
            // Caso não haja erros, conclui operação.
            return res
                .status(200)
                .json({success: true, data: disciplinaEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para buscar disciplina por ID
encDisciplinaPorID = async (req, res) => {
    // Encontra disciplina por ID fornecido na rota
    await Disciplina
        .findOne({
            _id: req.params.id
        }, (err, disciplinaEncontrado) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, error: err})
            }

            if (!disciplinaEncontrado) {
                return res
                    .status(404)
                    .json({success: false, error: "Disciplina não encontrada."})
            }

            return res
                .status(200)
                .json({success: true, data: disciplinaEncontrado})
        })
        .catch(err => console.log(err))
}

// Função para listar os disciplinas contidos no banco
listarDisciplinas = async (req, res) => {
    await Disciplina.find({}, (err, listaDisciplinas) => {
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaDisciplinas.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna lista de disciplinas
        return res.status(200).json({ success: true, data: listaDisciplinas })
    })
    // Havendo erro, retorna o erro
    .catch(err => console.log(err))
}

// Exporta os módulos
module.exports = {
    inserirDisciplina,
    atualizarDisciplina,
    removerDisciplina,
    encDisciplinaPorID,
    listarDisciplinas
}
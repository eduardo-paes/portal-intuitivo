const { get } = require('mongoose');
const RespostaAluno = require('../models/studentAnswer-model');
const Disciplina = require('../models/subject-model');
const Topico = require('../models/content-model');
const Progresso = require('../models/progressTopic-model');
const auxFunctions = require('../../server/utils/auxFunctions');
const AnoLetivoCtrl = require("../controllers/schoolYear-ctrl");
const AnoLetivo = require('../models/schoolYear-model');

// Função para gerar análise geral do aluno
const gerarAnaliseAluno = async (req, res) => {

    let resultadoDisciplinas = [
        { disciplina: 'Matemática', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'História', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Geografia', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Filosofia', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Sociologia', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Química', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Física', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Biologia', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Língua Portuguesa', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Literatura', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Inglês', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { disciplina: 'Espanhol', nota: 0, atividades: 0, acertos: 0, questoes: 0}
    ];

    let piorDesempenho, melhorDesempenho, piorTopico;
    let resultadoTopicos = [];

    const populateQuery = {
        path: 'atividadeID',  
        select: ['disciplinaID', 'areaConhecimento', 'topicoID'],
        populate: [{
            path: 'disciplinaID',
            select: 'nome'
        },
        {
            path: 'topicoID',
            select: 'topico'
        }]
    }

    let respostaAluno = await RespostaAluno.find({ alunoID: req.params.id }).populate(populateQuery)

    // Armazena o resultado em cada disciplina;
    respostaAluno.map(row => {
        if (row.corrigido) {
            const disciplina = row.atividadeID.disciplinaID.nome;
            const nota = row.nota;
            const questoes = row.respostaQuestaoIDs.length;
            const acertos = (row.nota ? row.nota : 0) * questoes / 100;
            resultadoDisciplinas.find(element => { 
                if (element.disciplina === disciplina) { 
                    nota ? element.nota += nota : element.nota += 0
                    element.atividades += 1;
                    element.acertos += acertos;
                    element.questoes += questoes;
                }
            })
        }
    });
    
    // Calcula a nota em cada disciplina e encontra a de pior desempenho e a de melhor desempenho;
    resultadoDisciplinas.map(row => {
        if (row.atividades > 0) {
            row.nota !== 0 ? row.nota = row.nota/row.atividades : null
            if (!piorDesempenho && !melhorDesempenho) {
                piorDesempenho = row;
                melhorDesempenho = row;
            } 
            else if (row.nota < piorDesempenho.nota) piorDesempenho = row;
            else if(row.nota > melhorDesempenho.nota) melhorDesempenho = row;
        }
    })

    // Armazena o resultado de cada tópico;
    respostaAluno.map(row => {
        if (row.corrigido) {
            if (row.atividadeID.disciplinaID.nome === piorDesempenho.disciplina) {
                const { topico } = row.atividadeID.topicoID;
                const nota = row.nota;
                const questoes = row.respostaQuestaoIDs.length;
                const acertos = (row.nota ? row.nota : 0) * questoes / 100;
                const atividades = 1;
                if (resultadoTopicos.find(element => {return element.topico === topico})) {
                    resultadoTopicos.find(element => { 
                        if (element.topico === topico) { 
                            nota ? element.nota += nota : element.nota += 0
                            element.atividades += 1;
                            element.acertos += acertos;
                            element.questoes += questoes;
                        }
                    })
                } else {
                    resultadoTopicos.push({topico, nota, atividades, acertos, questoes})
                }
            }
        }
    });

    // Calcula a nota em cada Tópico e encontra o de pior desempenho;
    resultadoTopicos.map(row => {
        if (row.atividades > 0) {
            row.nota !== 0 ? row.nota = row.nota/row.atividades : null
            if (!piorTopico) piorTopico = row; 
            else if (row.nota < piorTopico.nota) piorTopico = row;
        }
    })

    return res.json({piorDesempenho, melhorDesempenho, piorTopico});

}

const gerarProgressoDiario = async (req, res) => {  
    
    const { alunoID, dia, semana } = req.params;
    let topicos = [];

    let progressos = await Disciplina.find({diaSemana: dia}, '_id nome');

    for (let i = 0; i < progressos.length; ++i) {
        let res = await Topico.findOne({disciplinaID: progressos[i]._id, numeracao: semana}, '_id topico');
        if (res) {
            progressos[i] = {
                _id: progressos[i]._id,
                nome: progressos[i].nome,
                topicoID: res._id,
                topico: res.topico
            }
        }
    }

    for (let i = 0; i < progressos.length; ++i) {
        let res = await (await Progresso.findOne({alunoID: alunoID, topicoID: progressos[i].topicoID}, 'progresso'))
        let numTask = 0, progresso = 0;
        if (res) {

            if (res.progresso.materialEstudo !== undefined) {
                numTask += 1;
                if (res.progresso.materialEstudo === true) progresso += 1;
            }
            if (res.progresso.videoaula !== undefined) {
                numTask += 1;
                if (res.progresso.videoaula === true) progresso += 1;
            }
            if (res.progresso.exercicioFixacao !== undefined) {
                numTask += 1;
                if (res.progresso.exercicioFixacao === true) progresso += 1;
            }
            if (res.progresso.exercicioRetomada !== undefined) {
                numTask += 1;
                if (res.progresso.exercicioRetomada === true) progresso += 1;
            }
            if (res.progresso.exercicioAprofundamento !== undefined) {
                numTask += 1;
                if (res.progresso.exercicioAprofundamento === true) progresso += 1;
            }

            progressos[i] = {
                _id: progressos[i]._id,
                nome: progressos[i].nome,
                topicoID: progressos[i].topicoID,
                topico: progressos[i].topico,
                numTask,
                progresso
            }
        }
    }
    
    return res.json({progressos});

}

// // Função para atualizar resposta do aluno por ID
// atualizarRespostaAluno = async (req, res) => {
//     // Recebe dados do formulário
//     const body = req.body;
    
//     if (!body) {
//         return res.status(400).json({
//             success: false,
//             error: "Os dados devem ser fornecidos.",
//         })
//     }
    
//     const respostaAlunoAtualizada = new RespostaAluno(body);

//     // Verifica se dados não são nulos
//     if (!respostaAlunoAtualizada) {
//         return res
//             .status(400)
//             .json({success: false, error: "Os dados são nulos ou incompatíveis."})
//     }

//     // Busca a resposta do aluno pelo id (id da rota)
//     RespostaAluno.findOne({
//         _id: req.params.id
//     }, (err, respostaAlunoEncontrada) => {
//         if (err) {
//             return res
//                 .status(404)
//                 .json({
//                     err, 
//                     message: "Resposta do aluno não encontrada."
//                 })
//         }

//         // Atualiza dados da resposta do aluno encontrada
//         respostaAlunoEncontrada.alunoID = respostaAlunoAtualizada.alunoID
//         respostaAlunoEncontrada.atividadeID = respostaAlunoAtualizada.atividadeID
//         respostaAlunoEncontrada.revisaoID = respostaAlunoAtualizada.revisaoID
//         respostaAlunoEncontrada.respostaQuestaoIDs = respostaAlunoAtualizada.respostaQuestaoIDs
//         respostaAlunoEncontrada.corrigido = respostaAlunoAtualizada.corrigido
//         respostaAlunoEncontrada.nota = respostaAlunoAtualizada.nota

//         // Salva alterações
//         respostaAlunoEncontrada
//             .save()
//             .then(() => {
//                 return res.status(200).json({
//                     success: true,
//                     id: respostaAlunoEncontrada._id,
//                     message:"Resposta do aluno atualizada com sucesso.",
//                 })
//             })
//             .catch(error => {
//                 return res.status(404).json({
//                     error,
//                     message: "Resposta do aluno não atualizada.",
//                 })
//             });
//     });
// }

// // Função para remover respostaAluno por ID
// removerRespostaAluno = async (req, res) => {
//     // Encontra respostaQuestao pelo ID e remove
//     await RespostaAluno
//         .findOneAndDelete({
//             _id: req.params.id
//         }, (err, respostaAlunoEncontrada) => {


//             if (err) {
//                 console.log (err);
//                 return res
//                     .status(400)
//                     .json({
//                         success: false, 
//                         error: err
//                     })
//             }
            
//             // Caso não encontre nenhuma respostaQuestão
//             if (!respostaAlunoEncontrada) {
//                 return res
//                     .status(404)
//                     .json({
//                         success: false, 
//                         error: "Resposta aluno não encontrada."
//                     })
//             }

//             // Caso não haja erros, conclui operação.
//             return res
//                 .status(200)
//                 .json({
//                     success: true, 
//                     data: respostaAlunoEncontrada
//                 })
//         })
//         .catch(err => console.log(err))
// }

// // Função para buscar resposta do aluno pelo id do aluno e da atividade
// encRespostaAluno = async (req, res) => {
//     // Encontra resposta do aluno pelo id do aluno e da atividade fornecidos na rota
//     await RespostaAluno
//         .findOne({
//             alunoID: req.params.alunoID,
//             revisaoID: req.params.revisaoID
//         }, (err, respostaAlunoEncontrada) => {
//             if (err) {
//                 return res
//                     .status(400)
//                     .json({success: false, error: err})
//             }

//             if (!respostaAlunoEncontrada) {
//                 return res
//                     .json({success: false, error: "Resposta do aluno não encontrada."})
//             }

//             return res
//                 .status(200)
//                 .json({success: true, data: respostaAlunoEncontrada})
//         })
//         .catch(err => console.log(err))
// }

// // Função para buscar resposta do aluno por ID
// encRespostaAlunoPorID = async (req, res) => {
//     // Encontra resposta do aluno por ID fornecido na rota
//     await RespostaAluno
//         .findOne({
//             _id: req.params.id
//         }, (err, respostaAlunoEncontrada) => {
//             if (err) {
//                 return res
//                     .status(400)
//                     .json({success: false, error: err})
//             }

//             if (!respostaAlunoEncontrada) {
//                 return res
//                     .status(404)
//                     .json({success: false, error: "Resposta do aluno não encontrada."})
//             }

//             return res
//                 .status(200)
//                 .json({success: true, data: respostaAlunoEncontrada})
//         })
//         .catch(err => console.log(err))
// }

// // Função para listar respostaAluno contidos no banco
// listarRespostaAluno = async (req, res) => {
//     await RespostaAluno.find({})
//     .exec(function (err, listaRespostaAluno) {
//         // Verificação de erros
//         if (err) {
//             return res.status(400).json({ success: false, error: err })
//         }
//         // Verifica se há dados na lista
//         if (!listaRespostaAluno.length) {
//             return res
//                 .status(404)
//                 .json({ success: false, error: "Dados não encontrados." })
//         }
//         // Caso não haja erros, retorna lista de respostaAluno
//         return res.status(200).json({ success: true, data: listaRespostaAluno })
//     });
// }

// // Função para listar TQ por QuestaoID
// listarRAPorRespostaQuestaoID = async (req, res) => {
//     await RespostaAluno
//         .find({ respostaQuestaoIDs: req.params.id }, 
//             (err, respostaAlunoEncontrada) => {
//             if (err) {
//                 return res
//                     .status(400)
//                     .json({success: false, error: err})
//             }

//             if (!respostaAlunoEncontrada) {
//                 return res
//                     .status(404)
//                     .json({success: false, error: "Resposta do aluno não encontrada."})
//             }

//             return res
//                 .status(200)
//                 .json({success: true, data: respostaAlunoEncontrada})
//         })
//         .catch(err => console.log(err))
// }



// // Função para listar RA por AtividadeID
// listarRAPorAtividadeID = async (req, res) => {
//     const populateQuery = {
//         path: 'atividadeID', 
//         select: ['questoes', 'tipoAtividade'], 
//         populate: {
//             path: 'questoes',
//             populate: 'questaoID'
//         }
//     }
//     await RespostaAluno
//         .find({ atividadeID: req.params.atividadeID })
//         .populate({path: 'alunoID', select: 'nome'})
//         .populate(populateQuery)
//         .populate({path: 'respostaQuestaoIDs', select: ['nota', 'resposta', 'questaoID', 'comentario', 'corrigido']})
//         .exec((err, respostaAlunoEncontrada) => {
//             if (err) {
//                 return res
//                     .status(400)
//                     .json({success: false, error: err})
//             }

//             if (!respostaAlunoEncontrada) {
//                 return res
//                     .status(404)
//                     .json({success: false, error: "Resposta do aluno não encontrada."})
//             }

//             return res
//                 .status(200)
//                 .json({success: true, data: respostaAlunoEncontrada})
//         })
// }

// listarRespostaAlunoPorDisciplina = async (req, res) => {
//     const { disciplina } = req.params;
//     let array = [];

//     const populateQuery = {
//         path: 'atividadeID',
//         populate: {
//             path: 'topicoID',
//             select: ['topico','numeracao', 'disciplinaID'],
//             populate: {
//                 path: 'disciplinaID',
//                 select: 'nome',
//                 match: {
//                     _id: disciplina
//                 }
//             }
//         }
//     };
    
//     await RespostaAluno
//             .find({ corrigido: { $ne: true }  })
//             .populate('respostaQuestaoIDs')
//             .populate(populateQuery)
//             .exec((err, respostaAlunoEncontrada) => {
//             if (err) {
//                 return res
//                     .status(400)
//                     .json({success: false, error: err})
//             }
            
//             respostaAlunoEncontrada = respostaAlunoEncontrada.filter(function(item) {
//                 if (!array.find(element => element === item.atividadeID._id)) {
//                     array.push(item.atividadeID._id);
//                     return item.atividadeID.topicoID.disciplinaID;
//                 }    
//             });
            
//             if (respostaAlunoEncontrada.length === 0) {
//                 return res
//                     .status(404)
//                     .json({success: false, error: "Resposta do aluno não encontrada."})
//             }

//             return res
//                 .status(200)
//                 .json({success: true, data: respostaAlunoEncontrada})
//         })
// }

// contarRAsNaoCorrigidas = async (req, res) => {
//     const populateQuery = {
//         path: 'atividadeID',
//         populate: {
//             path: 'topicoID',
//             populate: {
//                 path: 'disciplinaID',
//                 match: {
//                     _id: req.params.disciplina
//                 }
//             }
//         }
//     };
    
//     await RespostaAluno
//             .countDocuments({ corrigido: false })
//             .populate(populateQuery)
//             .exec((err, contagem) => {
//             if (err) {
//                 return res
//                     .status(400)
//                     .json({success: false, error: err})
//             }

//             return res
//                 .status(200)
//                 .json({success: true, data: contagem})
//         })
// }

// Exporta os módulos
module.exports = {
    gerarAnaliseAluno,
    gerarProgressoDiario
}
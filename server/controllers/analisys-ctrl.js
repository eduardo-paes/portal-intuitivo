const RespostaAluno = require('../models/studentAnswer-model');
const Disciplina = require('../models/subject-model');
const Topico = require('../models/content-model');
const Progresso = require('../models/progressTopic-model');
const Usuario = require('../models/users-model');
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

// Função para gerar o progresso diário de determinado aluno
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

// Função para gerar análise geral do aluno
const gerarAnaliseProfessor = async (req, res) => {
    let { id } = req.params;
    let respostas = []; 
    let alunos = [];
    let topicos = [];
    let progressos = [];

    let analise = {
        mediaTurma: 0,
        questoes: {
            qCorretas: 0,
            qTotal: 0
        },
        alunos: {
            amNome: "",
            amNota: 0,
            apNome: "",
            apNota: 0,
        },
        topicos: {
            melhor: {
                tmID: "",
                tmNome: "",
                tmNota: 0,
                tmEstudado: 0,
                tmTotal: 0
            },
            pior: {
                tpID: "",
                tpNome: "",
                tpNota: 0,
                tpEstudado: 0,
                tpTotal: 0
            },
        },
        frequencia: {
            material: {
                mEstudado: 0,
                mTotal: 0
            },
            videoaula: {
                vAssistido: 0,
                vTotal: 0
            },
            atividade: {
                aFeito: 0,
                aTotal: 0
            }
        }
    }

    let respostaAluno = await RespostaAluno.find({}).populate({path: 'atividadeID', populate: {path: 'topicoID' }}).populate({path: 'alunoID'});

    respostaAluno.map(row => {    

        const disciplinaID = row.atividadeID.disciplinaID + '';
        
        const nome = row.alunoID.nome;
        const alunoID = row.alunoID._id;
        const nota = row.nota;

        const topicoID = row.atividadeID.topicoID._id;
        const topicoNome = row.atividadeID.topicoID.topico;

        if (disciplinaID === id && row.corrigido === true) {
            if (alunos.find(element => {return element.alunoID === alunoID})) {
                alunos.find(element => {
                    if (element.alunoID === alunoID) {
                        element.nota += nota;
                        element.atividades += 1;
                    }
                })
            } else {
                alunos.push({alunoID, nome, nota, atividades: 1})
            }
            if (topicos.find(element => {return element.topicoID === topicoID})) {
                topicos.find(element => {
                    if (element.topicoID === topicoID) {
                        element.nota += nota;
                        element.atividades += 1;
                    }
                })
            } else {
                topicos.push({topicoID, topicoNome, nota, atividades: 1})
            }
            respostas.push(row);
            analise.mediaTurma += (nota ? nota : null);
            analise.questoes.qTotal += row.respostaQuestaoIDs.length;
            analise.questoes.qCorretas += row.respostaQuestaoIDs.length * nota / 100;
        }
    })

    // Armazena o melhor e pior aluno;
    alunos.map(row => {
        row.nota = row.nota / row.atividades;
        if (analise.alunos.amNome === '') {
            analise.alunos.amNome = analise.alunos.apNome = row.nome;
            analise.alunos.apNota = analise.alunos.amNota = row.nota;
        }
        if (analise.alunos.apNota > row.nota) {
            analise.alunos.apNome = row.nome;
            analise.alunos.apNota = row.nota;
        } else if (analise.alunos.amNota < row.nota) {
            analise.alunos.amNome = row.nome;
            analise.alunos.amNota = row.nota;
        } 
    })

    // Armazena o melhor e pior tópico;
    topicos.map(row => {
        row.nota = row.nota / row.atividades;

        if (analise.topicos.melhor.tmNome === '') {
            analise.topicos.melhor.tmNome = analise.topicos.pior.tpNome = row.topicoNome;
            analise.topicos.pior.tpNota = analise.topicos.melhor.tmNota = row.nota;
            analise.topicos.pior.tpID = analise.topicos.melhor.tmID = row.topicoID;
        }
        if (analise.topicos.pior.tpNota > row.nota) {
            analise.topicos.pior.tpNome = row.topicoNome;
            analise.topicos.pior.tpNota = row.nota;
            analise.topicos.pior.tpID = row.topicoID;
        } else if (analise.topicos.melhor.tmNota < row.nota) {
            analise.topicos.melhor.tmNome = row.topicoNome;
            analise.topicos.melhor.tmNota = row.nota;
            analise.topicos.melhor.tmID = row.topicoID;
        } 
        progressos.push(row.topicoID);
    })

    analise.mediaTurma = analise.mediaTurma / (respostas.length ? respostas.length : 1);

    var key = '';
    
    progressos.map(async (row, index) => {
        await Progresso.find({topicoID: row}).then(progressoEncontrado => {

            progressoEncontrado.map((row, index) => { 
                key = row.topicoID + '';
                
                if (row.progresso.materialEstudo !== undefined) {
                    ++analise.frequencia.material.mTotal;
                    if (key === analise.topicos.melhor.tmID + '') {
                        ++analise.topicos.melhor.tmTotal;
                        if (row.progresso.materialEstudo === true) {
                            ++analise.topicos.melhor.tmEstudado;
                        }    
                    } 
                    if (key === analise.topicos.pior.tpID + '') {
                        ++analise.topicos.pior.tpTotal;
                        if (row.progresso.materialEstudo === true) ++analise.topicos.pior.tpEstudado;
                    }
                    if (row.progresso.materialEstudo === true) ++analise.frequencia.material.mEstudado;
                } 

                if (row.progresso.videoaula !== undefined) {
                    ++analise.frequencia.videoaula.vTotal;
                    if (key === analise.topicos.melhor.tmID + '') {
                        ++analise.topicos.melhor.tmTotal;
                        if (row.progresso.videoaula === true) ++analise.topicos.melhor.tmEstudado;
                    } 
                    if (key === analise.topicos.pior.tpID + '') {
                        ++analise.topicos.pior.tpTotal;
                        if (row.progresso.videoaula === true) ++analise.topicos.pior.tpEstudado;
                    }
                    if (row.progresso.videoaula === true) ++analise.frequencia.videoaula.vAssistido;
                } 

                if (row.progresso.exercicioFixacao !== undefined) {
                    ++analise.frequencia.atividade.aTotal;
                    if (key === analise.topicos.melhor.tmID + '') {
                        ++analise.topicos.melhor.tmTotal;
                        if (row.progresso.exercicioFixacao === true) ++analise.topicos.melhor.tmEstudado;
                    }
                    if (key === analise.topicos.pior.tpID + '') {
                        ++analise.topicos.pior.tpTotal;
                        if (row.progresso.exercicioFixacao === true) ++analise.topicos.pior.tpEstudado;
                    }
                    if (row.progresso.exercicioFixacao === true) ++analise.frequencia.atividade.aFeito;
                }

                if (row.progresso.exercicioRetomada !== undefined) {
                    ++analise.frequencia.atividade.aTotal;
                    if (key === analise.topicos.melhor.tmID + '') {
                        ++analise.topicos.melhor.tmTotal;
                        if (row.progresso.exercicioRetomada === true) ++analise.topicos.melhor.tmEstudado;
                    }
                    if (key === analise.topicos.pior.tpID + '') {
                        ++analise.topicos.pior.tpTotal;
                        if (row.progresso.exercicioRetomada === true) ++analise.topicos.pior.tpEstudado;
                    }
                    if (row.progresso.exercicioRetomada === true) ++analise.frequencia.atividade.aFeito;
                }

                if (row.progresso.exercicioAprofundamento !== undefined) {
                    ++analise.frequencia.atividade.aTotal;
                    if (key === analise.topicos.melhor.tmID + '') {
                        ++analise.topicos.melhor.tmTotal;
                        if (row.progresso.exercicioAprofundamento === true) ++analise.topicos.melhor.tmEstudado;
                    } 
                    if (key === analise.topicos.pior.tpID + '') {
                        ++analise.topicos.pior.tpTotal;
                        if (row.progresso.exercicioAprofundamento === true) ++analise.topicos.pior.tpEstudado;
                    }
                    if (row.progresso.exercicioAprofundamento === true) ++analise.frequencia.atividade.aFeito;
                }
            });
        });
    });

    return res.json({data: analise});
}

// Exporta os módulos
module.exports = {
    gerarAnaliseAluno,
    gerarProgressoDiario,
    gerarAnaliseProfessor
}
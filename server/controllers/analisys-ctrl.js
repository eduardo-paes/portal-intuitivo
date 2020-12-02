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
            apNota: 101,
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
                tpNota: 101,
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

    await RespostaAluno
        .find({})
        .populate({path: 'atividadeID', select: ['disciplinaID', 'topicoID'], populate: 'topicoID'})
        .populate({path: 'alunoID', select: 'nome'})
        .then(respostaAluno => {
            respostaAluno.map(row => {    
                
                const disciplinaID = row.atividadeID.disciplinaID + '';
                const nome = row.alunoID.nome;
                const alunoID = row.alunoID._id + '';
                const nota = row.nota;
                // console.log(row.atividadeID);
                const topicoID = row.atividadeID.topicoID._id + '';
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
                // console.log(row);
                row.nota = row.nota / row.atividades;
                if (analise.topicos.pior.tpNota > row.nota) {
                    analise.topicos.pior.tpNome = row.topicoNome;
                    analise.topicos.pior.tpNota = row.nota;
                    analise.topicos.pior.tpID = row.topicoID;
                }
                if (analise.topicos.melhor.tmNota < row.nota) {
                    analise.topicos.melhor.tmNome = row.topicoNome;
                    analise.topicos.melhor.tmNota = row.nota;
                    analise.topicos.melhor.tmID = row.topicoID;
                } 
                progressos.push(row.topicoID);
            })
        
            analise.mediaTurma = analise.mediaTurma / (respostas.length ? respostas.length : 1);
        })
    
    
    // console.log(analise);
    return res.json({data: analise, progresso: progressos});
}


const calcularProgresso = async (req, res) => {
    
    const { id, tmID, tpID } = req.params;
    let frequencia = {
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
    };
    let tmTotal = 0;
    let tmEstudado = 0;
    let tpTotal = 0;
    let tpEstudado = 0;

    const progressoEncontrado = await Progresso.find({topicoID: id});
    
    progressoEncontrado.map((row) => { 
        
        const key = row.topicoID + '';
        
        if (row.progresso.materialEstudo !== undefined) {
            ++frequencia.material.mTotal;
            if (key === tmID + '') {
                ++tmTotal;
                if (row.progresso.materialEstudo === true) {
                    ++tmEstudado;
                }    
            } 
            if (key === tpID + '') {
                ++tpTotal;
                if (row.progresso.materialEstudo === true) ++tpEstudado;
            }
            if (row.progresso.materialEstudo === true) ++frequencia.material.mEstudado;
        } 

        if (row.progresso.videoaula !== undefined) {
            ++frequencia.videoaula.vTotal;
            if (key === tmID + '') {
                ++tmTotal;
                if (row.progresso.videoaula === true) ++tmEstudado;
            } 
            if (key === tpID + '') {
                ++tpTotal;
                if (row.progresso.videoaula === true) ++tpEstudado;
            }
            if (row.progresso.videoaula === true) ++frequencia.videoaula.vAssistido;
        } 

        if (row.progresso.exercicioFixacao !== undefined) {
            ++frequencia.atividade.aTotal;
            if (key === tmID + '') {
                ++tmTotal;
                if (row.progresso.exercicioFixacao === true) ++tmEstudado;
            }
            if (key === tpID + '') {
                ++tpTotal;
                if (row.progresso.exercicioFixacao === true) ++tpEstudado;
            }
            if (row.progresso.exercicioFixacao === true) ++frequencia.atividade.aFeito;
        }

        if (row.progresso.exercicioRetomada !== undefined) {
            ++frequencia.atividade.aTotal;
            if (key === tmID + '') {
                ++tmTotal;
                if (row.progresso.exercicioRetomada === true) ++tmEstudado;
            }
            if (key === tpID + '') {
                ++tpTotal;
                if (row.progresso.exercicioRetomada === true) ++tpEstudado;
            }
            if (row.progresso.exercicioRetomada === true) ++frequencia.atividade.aFeito;
        }

        if (row.progresso.exercicioAprofundamento !== undefined) {
            ++frequencia.atividade.aTotal;
            if (key === tmID + '') {
                ++tmTotal;
                if (row.progresso.exercicioAprofundamento === true) ++tmEstudado;
            } 
            if (key === tpID + '') {
                ++tpTotal;
                if (row.progresso.exercicioAprofundamento === true) ++tpEstudado;
            }
            if (row.progresso.exercicioAprofundamento === true) ++frequencia.atividade.aFeito;
        }
    });

    return res.json({frequencia, tmTotal, tmEstudado, tpTotal, tpEstudado});
}

const gerarAnaliseAdministrador = async (req, res) => {

    let analise = {
        porArea: {
          linguagens: {
            mediaAlunos: 0,
            atividades: {
              parte: 0,
              total: 0
            },
            questoes: {
              parte: 0,
              total: 0
            },
            topicos: {
              parte: 0,
              total: 0
            },
            videoaulas: {
              parte: 0,
              total: 0
            },
          },
          matematica: {
            mediaAlunos: 0,
            atividades: {
              parte: 0,
              total: 0
            },
            questoes: {
              parte: 0,
              total: 0
            },
            topicos: {
              parte: 0,
              total: 0
            },
            videoaulas: {
              parte: 0,
              total: 0
            },
          },
          cienciasHumanas: {
            mediaAlunos: 0,
            atividades: {
              parte: 0,
              total: 0
            },
            questoes: {
              parte: 0,
              total: 0
            },
            topicos: {
              parte: 0,
              total: 0
            },
            videoaulas: {
              parte: 0,
              total: 0
            },
          },
          cienciasNaturais: {
            mediaAlunos: 0,
            atividades: {
              parte: 0,
              total: 0
            },
            questoes: {
              parte: 0,
              total: 0
            },
            topicos: {
              parte: 0,
              total: 0
            },
            videoaulas: {
              parte: 0,
              total: 0
            },
          },
        },
        porDisciplina: {
          linguagens: {
            melhor: {
              nome: 0,
              nota: 0,
              parte: 0,
              total: 0
            },
            pior: {
              nome: 0,
              nota: 0,
              parte: 0,
              total: 0
            }
          },
          matematica: {
            melhor: {
              nome: 0,
              nota: 0,
              parte: 0,
              total: 0
            },
            pior: {
              nome: 0,
              nota: 0,
              parte: 0,
              total: 0
            }
          },
          cienciasHumanas: {
            melhor: {
              nome: 0,
              nota: 0,
              parte: 0,
              total: 0
            },
            pior: {
              nome: 0,
              nota: 0,
              parte: 0,
              total: 0
            }
          },
          cienciasNaturais: {
            melhor: {
              nome: 0,
              nota: 0,
              parte: 0,
              total: 0
            },
            pior: {
              nome: 0,
              nota: 0,
              parte: 0,
              total: 0
            }
          },
        }
    } 

    let resultadoDisciplinas = [
        { areaConhecimento: '', disciplina: 'Matemática', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'História', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Geografia', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Filosofia', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Sociologia', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Química', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Física', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Biologia', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Língua Portuguesa', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Literatura', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Inglês', nota: 0, atividades: 0, acertos: 0, questoes: 0},
        { areaConhecimento: '', disciplina: 'Espanhol', nota: 0, atividades: 0, acertos: 0, questoes: 0}
    ];

    var linguagens = { 
        total: 0,
        atividades: 0,
        melhor: {
            nome: '',
            nota: 0,
            parte: 0,
            total: 0
        },
        pior: {
            nome: '',
            nota: 101,
            parte: 0,
            total: 0
        } 
    }
    var matematica = {
        total: 0, 
        atividades: 0,
        melhor: {
            nome: '',
            nota: 0,
            parte: 0,
            total: 0
        },
        pior: {
            nome: '',
            nota: 101,
            parte: 0,
            total: 0
        } 
    }
    var cienciasHumanas = {
        total: 0, 
        atividades: 0,
        melhor: {
            nome: '',
            nota: 0,
            parte: 0,
            total: 0
        },
        pior: {
            nome: '',
            nota: 101,
            parte: 0,
            total: 0
        } 
    }
    var cienciasNaturais = {
        total: 0, 
        atividades: 0,
        melhor: {
            nome: '',
            nota: 0,
            parte: 0,
            total: 0
        },
        pior: {
            nome: '',
            nota: 101,
            parte: 0,
            total: 0
        } 
    }
    
    await RespostaAluno
        .find({})
        .populate({path: 'atividadeID', select: ['disciplinaID', 'areaConhecimento'], populate: {path: 'disciplinaID', select: 'nome'}})
        .then(respostaAluno => {
            respostaAluno.map(row => {
                if (row.corrigido) {
                    if (row.atividadeID.areaConhecimento === 'Linguagens') {
                        linguagens.total += row.nota;
                        linguagens.atividades += 1;
                    } else if (row.atividadeID.areaConhecimento === 'Matemática') {
                        matematica.total += row.nota;
                        matematica.atividades += 1;
                    } else if (row.atividadeID.areaConhecimento === 'Ciências Humanas') {
                        cienciasHumanas.total += row.nota;
                        cienciasHumanas.atividades += 1;
                    } else {
                        cienciasNaturais.total += row.nota;
                        cienciasNaturais.atividades += 1;
                    }

                    resultadoDisciplinas.find(element => {
                        if (element.disciplina === row.atividadeID.disciplinaID.nome) {
                            element.nota += row.nota;
                            element.atividades += 1;
                            element.questoes += row.respostaQuestaoIDs.length;
                            element.acertos += (row.nota*row.respostaQuestaoIDs.length)/100;
                            element.areaConhecimento = row.atividadeID.areaConhecimento;
                        }
                    })
                }
            });
        
            if (linguagens.total !== 0) analise.porArea.linguagens.mediaAlunos = linguagens.total / linguagens.atividades;
            if (matematica.total !== 0) analise.porArea.matematica.mediaAlunos = matematica.total / matematica.atividades;
            if (cienciasHumanas.total !== 0) analise.porArea.cienciasHumanas.mediaAlunos = cienciasHumanas.total / cienciasHumanas.atividades;
            if (cienciasNaturais.total !== 0) analise.porArea.cienciasNaturais.mediaAlunos = cienciasNaturais.total / cienciasNaturais.atividades;

            resultadoDisciplinas.map(row => {
                // console.log(row);
                if (row.atividades > 0) row.nota = row.nota / row.atividades;
                if (row.areaConhecimento === 'Linguagens') {
                    if (row.nota > linguagens.melhor.nota) {
                        linguagens.melhor.nota = row.nota;
                        linguagens.melhor.nome = row.disciplina;
                    } else if (row.nota < linguagens.pior.nota) {
                        linguagens.pior.nota = row.nota;
                        linguagens.pior.nome = row.disciplina;
                    }
                } else if (row.areaConhecimento === 'Matemática') {
                    if (row.nota > matematica.melhor.nota) {
                        matematica.melhor.nota = row.nota;
                        matematica.melhor.nome = row.disciplina;
                    } else if (row.nota < matematica.pior.nota) {
                        matematica.pior.nota = row.nota;
                        matematica.pior.nome = row.disciplina;
                    }
                } else if (row.areaConhecimento === 'Ciências Humanas') {
                    if (row.nota > cienciasHumanas.melhor.nota) {
                        cienciasHumanas.melhor.nota = row.nota;
                        cienciasHumanas.melhor.nome = row.disciplina;
                    } else if (row.nota < cienciasHumanas.pior.nota) {
                        cienciasHumanas.pior.nota = row.nota;
                        cienciasHumanas.pior.nome = row.disciplina;
                    }
                } else if (row.areaConhecimento === 'Ciências da Natureza') {
                    if (row.nota > cienciasNaturais.melhor.nota) {
                        cienciasNaturais.melhor.nota = row.nota;
                        cienciasNaturais.melhor.nome = row.disciplina;
                    } else if (row.nota < cienciasNaturais.pior.nota) {
                        cienciasNaturais.pior.nota = row.nota;
                        cienciasNaturais.pior.nome = row.disciplina;
                    }
                }
            })
        
            analise.porDisciplina.linguagens.melhor = linguagens.melhor;
            analise.porDisciplina.linguagens.pior = linguagens.pior;
            analise.porDisciplina.matematica.melhor = matematica.melhor;
            analise.porDisciplina.matematica.pior = matematica.pior;
            analise.porDisciplina.cienciasHumanas.melhor = cienciasHumanas.melhor;
            analise.porDisciplina.cienciasHumanas.pior = cienciasHumanas.pior;
            analise.porDisciplina.cienciasNaturais.melhor = cienciasNaturais.melhor;
            analise.porDisciplina.cienciasNaturais.pior = cienciasNaturais.pior;
        })


    return res.json({analise})
}


// Exporta os módulos
module.exports = {
    gerarAnaliseAluno,
    gerarProgressoDiario,
    gerarAnaliseProfessor,
    calcularProgresso,
    gerarAnaliseAdministrador
}
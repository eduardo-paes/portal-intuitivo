// Define as rotas que serão utilizadas para lidar com o banco de dados
const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const router = express.Router();

// Aplicação do body-parser
router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json());

// Importação dos métodos de controle
const UsuarioCtrl = require("../controllers/user-ctrl");
const ConteudoCtrl = require("../controllers/content-ctrl");
const DisciplinaCtrl = require("../controllers/subject-ctrl");
const TagCtrl = require("../controllers/tag-ctrl");
const AnoLetivoCtrl = require("../controllers/schoolYear-ctrl");
const QuestaoCtrl = require("../controllers/question-ctrl");
const RespostaQuestaoCtrl = require("../controllers/answerQuestion-ctrl");
const RespostaAlunoCtrl = require("../controllers/studentAnswer-ctrl");
const AtividadeCtrl = require("../controllers/activity-ctrl");
const RevisaoCtrl = require("../controllers/revision-ctrl");
const ClassLinkCtrl = require("../controllers/classLink-ctrl");
const ProgressoCtrl = require("../controllers/generalProgress-ctrl");
const AnaliseCtrl = require("../controllers/analisys-ctrl");

// USUÁRIO -- Definição dos métodos para cada rota do usuário
router.post("/controle-usuario", UsuarioCtrl.inserirUsuario);
router.put("/controle-usuario/:id", UsuarioCtrl.atualizarUsuario);
router.delete("/controle-usuario/:id", UsuarioCtrl.removerUsuario);
router.get("/controle-usuario/:id", UsuarioCtrl.encUsuarioPorID);
router.get("/controle-usuario", UsuarioCtrl.listarUsuarios);
router.get("/login/:email", UsuarioCtrl.encUsuarioPorEmail);
router.post("/confirmar-usuario", UsuarioCtrl.confirmarUsuario); 

// CONTEÚDO -- Definição dos métodos para cada rota do conteúdo
router.post("/controle-conteudo", ConteudoCtrl.inserirConteudo);
router.put("/controle-conteudo/:id", ConteudoCtrl.atualizarConteudo);
router.delete("/controle-conteudo/:id", ConteudoCtrl.removerConteudo);
router.get("/controle-conteudo/:id", ConteudoCtrl.encConteudoPorID);
router.get("/controle-conteudo", ConteudoCtrl.listarConteudos);
router.get("/controle-conteudo/disciplina/:id", ConteudoCtrl.listarConteudoPorDisciplina);
router.get(`/controle-conteudo/filtro/:numeracao?/:disciplinaID?/:topicoID?`, ConteudoCtrl.listarConteudoPorFiltro);
router.get(`/controle-conteudo/topico/:id?/:numeracao?`, ConteudoCtrl.encConteudoPersonalizado);
router.get(`/controle-conteudo/corrente/:numeracao?/:diaSemana?`, ConteudoCtrl.listarConteudoCorrente);

// DISCIPLINA -- Definição dos métodos para cada rota da disciplina
router.post("/configuracoes/disciplina", DisciplinaCtrl.inserirDisciplina);
router.put("/configuracoes/disciplina/:id", DisciplinaCtrl.atualizarDisciplina);
router.delete("/configuracoes/disciplina/:id", DisciplinaCtrl.removerDisciplina);
router.get("/configuracoes/disciplina/:id", DisciplinaCtrl.encDisciplinaPorID);
router.get("/configuracoes/disciplina", DisciplinaCtrl.listarDisciplinas);
router.get("/plano-estudo/disciplina/:dia?", DisciplinaCtrl.listarDisciplinasPorDiaDaSemana);

// TAG -- Definição dos métodos para cada rota da tag
router.post("/configuracoes/tag", TagCtrl.inserirTag);
router.put("/configuracoes/tag/:id", TagCtrl.atualizarTag);
router.delete("/configuracoes/tag/:id", TagCtrl.removerTag);
router.get("/configuracoes/tag/:id", TagCtrl.encTagPorID);
router.get("/configuracoes/tag", TagCtrl.listarTags);
router.get("/configuracoes/tags/:id", TagCtrl.listarTagsPorDisciplina);

// ANO LETIVO -- Definição dos métodos para cada rota da ano letivo
router.post("/configuracoes/ano-letivo", AnoLetivoCtrl.inserirAnoLetivo);
router.put("/configuracoes/ano-letivo/:id", AnoLetivoCtrl.atualizarAnoLetivo);
router.delete("/configuracoes/ano-letivo/:id", AnoLetivoCtrl.removerAnoLetivo);
router.get("/configuracoes/ano-letivo/:id", AnoLetivoCtrl.encAnoLetivoPorID);
router.get("/configuracoes/ano-letivo", AnoLetivoCtrl.listarAnoLetivo);

// QUESTÃO -- Definição dos métodos para cada rota de questão
router.post("/controle-questao", QuestaoCtrl.inserirQuestao);
router.put("/controle-questao/:id", QuestaoCtrl.atualizarQuestao);
router.delete("/controle-questao/:id", QuestaoCtrl.removerQuestao);
router.get("/controle-questao/:id", QuestaoCtrl.encQuestaoPorID);
router.get("/controle-questao", QuestaoCtrl.listarQuestao);
router.get("/controle-questao/topico/:id", QuestaoCtrl.listarQuestaoPorTopico);
router.get("/controle-questao/disciplina/:id", QuestaoCtrl.listarQuestaoPorDisciplina);
router.get("/controle-questao/area/:area", QuestaoCtrl.listarQuestaoPorArea);
router.get("/controle-questao/tags/:id", QuestaoCtrl.listarTQPorQuestaoID);

// RESPOSTA-QUESTÃO -- Definição dos métodos para cada rota de respostaQuestão
router.post("/resposta-questao", RespostaQuestaoCtrl.inserirRespostaQuestao);
router.put("/resposta-questao/:id", RespostaQuestaoCtrl.atualizarRespostaQuestao);
router.delete("/resposta-questao/:id", RespostaQuestaoCtrl.removerRespostaQuestao);
router.get("/resposta-questao/:id", RespostaQuestaoCtrl.encRespostaQuestaoPorID);
router.get("/resposta-questao/atividade/:alunoID/:atividadeID", RespostaQuestaoCtrl.listarRQPorAtividadeID);
router.get("/resposta-questao/revisao/:alunoID/:revisaoID", RespostaQuestaoCtrl.listarRQPorRevisaoID);
router.get("/resposta-questao/atividade/:atividadeID/:alunoID/:questaoID", RespostaQuestaoCtrl.encRespostaQuestaoPorAtividade);
router.get("/resposta-questao/revisao/:revisaoID/:alunoID/:questaoID", RespostaQuestaoCtrl.encRespostaQuestaoPorRevisao);
router.get("/resposta-questao", RespostaQuestaoCtrl.listarRespostaQuestao);
router.get("/resposta-questao/questao/:id", RespostaQuestaoCtrl.listarRQPorQuestaoID);
router.get("/resposta-questao/user/:id", RespostaQuestaoCtrl.listarRQPorAlunoID);

// RESPOSTA-ALUNO -- Definição dos métodos para cada rota de respostaAluno
router.post("/resposta-aluno", RespostaAlunoCtrl.inserirRespostaAluno);
router.put("/resposta-aluno/:id", RespostaAlunoCtrl.atualizarRespostaAluno);
router.delete("/resposta-aluno/:id", RespostaAlunoCtrl.removerRespostaAluno);
router.get("/resposta-aluno/:id", RespostaAlunoCtrl.encRespostaAlunoPorID);
router.get("/resposta-aluno", RespostaAlunoCtrl.listarRespostaAluno);
router.get("/resposta-aluno/respostaquestao/:id", RespostaAlunoCtrl.listarRAPorRespostaQuestaoID);
router.get("/resposta-aluno/user/:id", RespostaAlunoCtrl.listarRAPorAlunoID);
router.get("/resposta-aluno/atividade/:atividadeID", RespostaAlunoCtrl.listarRAPorAtividadeID);
router.get("/resposta-aluno/correcoes/:disciplina", RespostaAlunoCtrl.listarRespostaAlunoPorDisciplina);
router.get("/resposta-aluno/contagem/:disciplina", RespostaAlunoCtrl.contarRAsNaoCorrigidas);

// ATIVIDADE -- Definição dos métodos para cada rota de atividade
router.post("/controle-atividade", AtividadeCtrl.inserirAtividade);
router.put("/controle-atividade/:id", AtividadeCtrl.atualizarAtividade);
router.delete("/controle-atividade/:id", AtividadeCtrl.removerAtividade);
router.get("/controle-atividade/:id", AtividadeCtrl.encAtividadePorID);
router.get("/controle-atividade/questoes/:id", AtividadeCtrl.encQuestoesDaAtividadeID);
router.get("/controle-atividade", AtividadeCtrl.listarAtividade);
router.get("/controle-atividade/topico/:id", AtividadeCtrl.listarAtividadesPorTopico);
router.get("/controle-atividade/disciplina/:id", AtividadeCtrl.listarAtividadePorDisciplina);
router.get("/controle-atividade/redacao/:numeracao", AtividadeCtrl.encRedacaoDaSemana);
router.get("/controle-atividade/proposta-redacao/:id", AtividadeCtrl.encPropostaRedacao);

// REVISAO -- Definição dos métodos para cada rota de atividade
router.post("/controle-revisao", RevisaoCtrl.inserirRevisao);
router.put("/controle-revisao/:id", RevisaoCtrl.atualizarRevisao);
router.delete("/controle-revisao/:id", RevisaoCtrl.removerRevisao);
router.get("/controle-revisao/:id", RevisaoCtrl.encRevisaoPorID);
router.get("/controle-revisao/:numeracao/:area", RevisaoCtrl.encRevisaoPelaNumeracaoEArea);
router.get("/controle-revisao", RevisaoCtrl.listarRevisao);

// CLASSLINK -- Definição dos métodos para cada rota de classLink
router.post("/aula-link", ClassLinkCtrl.inserirClassLink);
router.put("/aula-link/:id", ClassLinkCtrl.atualizarClassLink);
router.delete("/aula-link/:id", ClassLinkCtrl.removerClassLink);
router.get("/aula-link/:id", ClassLinkCtrl.encClassLinkPorID);
router.get("/aula-link", ClassLinkCtrl.listarClassLink);  

// PROGRESSO -- Definição dos métodos para cada rota de progressoTopico
router.post("/progresso-conteudo", ProgressoCtrl.inserirProgresso);
router.put("/progresso-conteudo/:id", ProgressoCtrl.atualizarProgresso);
router.delete("/progresso-conteudo/:id", ProgressoCtrl.removerProgresso);
router.get("/progresso-conteudo/:id", ProgressoCtrl.encProgressoPorID);
router.get("/progresso-conteudo/topico/:alunoID/:topicoID", ProgressoCtrl.encProgressoPorTopico);
router.get("/progresso-conteudo/aluno/:id", ProgressoCtrl.listarProgressoPorAluno);

// PROGRESSO -- Definição dos métodos para cada rota de progressoRedacao
router.post("/progresso-redacao", ProgressoCtrl.inserirProgressoRedacao);
router.put("/progresso-redacao/:id", ProgressoCtrl.atualizarProgressoRedacao);
router.delete("/progresso-redacao/:id", ProgressoCtrl.removerProgressoRedacao);
router.get("/progresso-redacao/:id", ProgressoCtrl.encProgressoRedacaoPorID);
router.get("/progresso-redacao/lista/:alunoID/:redacaoID", ProgressoCtrl.encProgressoPorRedacaoID);
router.get("/progresso-redacao/correcoes/:disciplina", ProgressoCtrl.listarRedacoesNaoCorrigidas);
router.get("/progresso-redacao/redacaoID/:redacaoID", ProgressoCtrl.listarRedacoesNaoCorrigidasPorRedacaoID);
router.get("/progresso-redacao/contagem/:disciplina", ProgressoCtrl.contarRedacoesNaoCorrigidas);

// PROGRESSO -- Definição dos métodos para cada rota de progressoRevisao
router.post("/progresso-revisao", ProgressoCtrl.inserirProgressoRevisao);
router.put("/progresso-revisao/:id", ProgressoCtrl.atualizarProgressoRevisao);
router.delete("/progresso-revisao/:id", ProgressoCtrl.removerProgressoRevisao);
router.get("/progresso-revisao/:id", ProgressoCtrl.encProgressoRevisaoPorID);
router.get("/progresso-revisao/:alunoID/:revisaoID", ProgressoCtrl.encProgressoPorRevisaoID);

router.get("/analises/:id", AnaliseCtrl.gerarAnaliseAluno);

module.exports = router;
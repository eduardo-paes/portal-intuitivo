import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// -- Funções relacionadas ao Usuário
export const inserirUsuario = novoUsuario => api.post("/controle-usuario", novoUsuario);
export const listarUsuarios = () => api.get("/controle-usuario");
export const atualizarUsuario = (id, usuarioAtualizado) => api.put(`/controle-usuario/${id}`, usuarioAtualizado);
export const removerUsuario = id => api.delete(`/controle-usuario/${id}`);
export const encUsuarioPorID = id => api.get(`/controle-usuario/${id}`);

// -- Funções relacionadas ao Conteúdo
export const inserirConteudo = novoConteudo => api.post("/controle-conteudo", novoConteudo);
export const listarConteudos = () => api.get("/controle-conteudo");
export const atualizarConteudo = (id, conteudoAtualizado) => api.put(`/controle-conteudo/${id}`, conteudoAtualizado);
export const removerConteudo = id => api.delete(`/controle-conteudo/${id}`);
export const encConteudoPorID = id => api.get(`/controle-conteudo/${id}`);
export const listarConteudoPorDisciplina = id => api.get(`/controle-conteudo/disciplina/${id}`);
export const listarConteudoPersonalizado = (id, area, numeracao) => api.get(`/controle-conteudo/topico/${id}/${area}/${numeracao}`);

// -- Funções relacionadas à Disciplina
export const inserirDisciplina = novaDisciplina => api.post("/configuracoes/disciplina", novaDisciplina);
export const listarDisciplinas = () => api.get("/configuracoes/disciplina");
export const atualizarDisciplina = (id, disciplinaAtualizada) => api.put(`/configuracoes/disciplina/${id}`, disciplinaAtualizada);
export const removerDisciplina = id => api.delete(`/configuracoes/disciplina/${id}`);
export const encDisciplinaPorID = id => api.get(`/configuracoes/disciplina/${id}`);
export const listarDisciplinasPorDiaDaSemana = (dia) => api.get(`/plano-estudo/disciplina/${dia}`);

// -- Funções relacionadas à Tag
export const inserirTag = novaTag => api.post("/configuracoes/tag", novaTag);
export const listarTags = () => api.get("/configuracoes/tag");
export const atualizarTag = (id, tagAtualizada) => api.put(`/configuracoes/tag/${id}`, tagAtualizada);
export const removerTag = id => api.delete(`/configuracoes/tag/${id}`);
export const encTagPorID = id => api.get(`/configuracoes/tag/${id}`);
export const listarTagsPorDisciplina = id => api.get(`/configuracoes/tags/${id}`);

// -- Funções relacionadas à TagQuestao
export const inserirTagQuestao = novaTagQuestao => api.post("/tag-questao", novaTagQuestao);
export const listarTagQuestao = () => api.get("/tag-questao");
export const atualizarTagQuestao = (id, tagQuestaoAtualizada) => api.put(`/tag-questao/${id}`, tagQuestaoAtualizada);
export const removerTagQuestao = id => api.delete(`/tag-questao/${id}`);
export const encTagQuestaoPorID = id => api.get(`/tag-questao/${id}`);
export const listarTQPorQuestaoID = questaoID => api.get(`/tag-questao/questao/${questaoID}`);

// -- Funções relacionadas à AnoLetivo
export const inserirAnoLetivo = novaAnoLetivo => api.post("/configuracoes/ano-letivo", novaAnoLetivo);
export const listarAnoLetivo = () => api.get("/configuracoes/ano-letivo");
export const atualizarAnoLetivo = (id, anoLetivoAtualizado) => api.put(`/configuracoes/ano-letivo/${id}`, anoLetivoAtualizado);
export const removerAnoLetivo = id => api.delete(`/configuracoes/ano-letivo/${id}`);
export const encAnoLetivoPorID = id => api.get(`/configuracoes/ano-letivo/${id}`);

// -- Funções relacionadas à Questão
export const inserirQuestao = novaQuestao => api.post("/controle-questao", novaQuestao);
export const listarQuestao = () => api.get("/controle-questao");
export const atualizarQuestao = (id, questaoAtualizada) => api.put(`/controle-questao/${id}`, questaoAtualizada);
export const removerQuestao = id => api.delete(`/controle-questao/${id}`);
export const encQuestaoPorID = id => api.get(`/controle-questao/${id}`);
export const listarQuestaoPorTopico = id => api.get(`/controle-questao/topico/${id}`);
export const listarQuestaoPorArea = area => api.get(`/controle-questao/area/${area}`);

// -- Funções relacionadas à Atividade
export const inserirAtividade = novaAtividade => api.post("/controle-atividade", novaAtividade);
export const listarAtividades = () => api.get("/controle-atividade");
export const atualizarAtividade = (id, atividadeAtualizada) => api.put(`/controle-atividade/${id}`, atividadeAtualizada);
export const removerAtividade = id => api.delete(`/controle-atividade/${id}`);
export const encAtividadePorID = id => api.get(`/controle-atividade/${id}`);
export const listarAtividadesPorTopico = (id) => api.get(`/plano-estudo/${id}`);

// -- Funções relacionadas à Revisao
export const inserirRevisao = novaRevisao => api.post("/controle-revisao", novaRevisao);
export const listarRevisao = () => api.get("/controle-revisao");
export const atualizarRevisao = (id, revisaoAtualizada) => api.put(`/controle-revisao/${id}`, revisaoAtualizada);
export const removerRevisao = id => api.delete(`/controle-revisao/${id}`);
export const encRevisaoPorID = id => api.get(`/controle-revisao/${id}`);

const apis = {
    // Usuário
    inserirUsuario,
    listarUsuarios,
    atualizarUsuario,
    removerUsuario,
    encUsuarioPorID,
    // Conteúdo
    inserirConteudo,
    listarConteudos,
    atualizarConteudo,
    removerConteudo,
    encConteudoPorID,
    listarConteudoPorDisciplina,
    listarConteudoPersonalizado,
    // Disciplina
    inserirDisciplina,
    listarDisciplinas,
    atualizarDisciplina,
    removerDisciplina,
    encDisciplinaPorID,
    listarDisciplinasPorDiaDaSemana,
    // Tag
    inserirTag,
    listarTags,
    atualizarTag,
    removerTag,
    encTagPorID,
    listarTagsPorDisciplina,
    // Tag-Questão
    inserirTagQuestao,
    listarTagQuestao,
    atualizarTagQuestao,
    removerTagQuestao,
    encTagQuestaoPorID,
    listarTQPorQuestaoID,
    // Ano Letivo
    inserirAnoLetivo,
    listarAnoLetivo,
    atualizarAnoLetivo,
    removerAnoLetivo,
    encAnoLetivoPorID,
    // Questão
    inserirQuestao,
    listarQuestao,
    atualizarQuestao,
    removerQuestao,
    encQuestaoPorID,
    listarQuestaoPorTopico,
    listarQuestaoPorArea,
    // Atividade
    inserirAtividade,
    listarAtividades,
    atualizarAtividade,
    removerAtividade,
    encAtividadePorID,
    listarAtividadesPorTopico,
    // Revisão
    inserirRevisao,
    listarRevisao,
    atualizarRevisao,
    removerRevisao,
    encRevisaoPorID,
}

export default apis;
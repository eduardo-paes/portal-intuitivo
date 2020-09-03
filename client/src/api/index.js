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
export const listarConteudoPersonalizado = (area, id, numeracao) => api.get(`/controle-conteudo/topicos/${id || area || numeracao}`);

// -- Funções relacionadas à Disciplina
export const inserirDisciplina = novaDisciplina => api.post("/configuracoes/disciplina", novaDisciplina);
export const listarDisciplinas = () => api.get("/configuracoes/disciplina");
export const atualizarDisciplina = (id, disciplinaAtualizada) => api.put(`/configuracoes/disciplina/${id}`, disciplinaAtualizada);
export const removerDisciplina = id => api.delete(`/configuracoes/disciplina/${id}`);
export const encDisciplinaPorID = id => api.get(`/configuracoes/disciplina/${id}`);

// -- Funções relacionadas à Tag
export const inserirTag = novaTag => api.post("/configuracoes/tag", novaTag);
export const listarTags = () => api.get("/configuracoes/tag");
export const atualizarTag = (id, tagAtualizada) => api.put(`/configuracoes/tag/${id}`, tagAtualizada);
export const removerTag = id => api.delete(`/configuracoes/tag/${id}`);
export const encTagPorID = id => api.get(`/configuracoes/tag/${id}`);
export const listarTagsPorDisciplina = id => api.get(`/configuracoes/tags/${id}`);

// -- Funções relacionadas à Questão
export const inserirQuestao = novaQuestao => api.post("/controle-questao", novaQuestao);
export const listarQuestao = () => api.get("/controle-questao");
export const atualizarQuestao = (id, questaoAtualizada) => api.put(`/controle-questao/${id}`, questaoAtualizada);
export const removerQuestao = id => api.delete(`/controle-questao/${id}`);
export const encQuestaoPorID = id => api.get(`/controle-questao/${id}`);
export const listarQuestaoPorTopico = id => api.get(`/controle-questao/topico/${id}`);

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
    // Tag
    inserirTag,
    listarTags,
    atualizarTag,
    removerTag,
    encTagPorID,
    listarTagsPorDisciplina,
    // Questão
    inserirQuestao,
    listarQuestao,
    atualizarQuestao,
    removerQuestao,
    encQuestaoPorID,
    listarQuestaoPorTopico
}

export default apis;
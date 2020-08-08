import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
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

// -- Funções relacionadas à Disciplina
export const inserirDisciplina = novaDisciplina => api.post("/configuracoes/disciplina", novaDisciplina);
export const listarDisciplinas = () => api.get("/configuracoes");
export const atualizarDisciplina = (id, disciplinaAtualizada) => api.put(`/configuracoes/disciplina/${id}`, disciplinaAtualizada);
export const removerDisciplina = id => api.delete(`/configuracoes/disciplina/${id}`);
export const encDisciplinaPorID = id => api.get(`/configuracoes/disciplina/${id}`);

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
    // Disciplina
    inserirDisciplina,
    listarDisciplinas,
    atualizarDisciplina,
    removerDisciplina,
    encDisciplinaPorID
}

export default apis;
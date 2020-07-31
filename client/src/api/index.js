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

// export const uploadArquivo = (formData, config) => api.post()

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
    encConteudoPorID
}

export default apis;
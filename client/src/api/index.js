import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

export const inserirUsuario = novoUsuario => api.post("/controle-usuario", novoUsuario);
export const listarUsuarios = () => api.get("/controle-usuario");
export const atualizarUsuario = (id, usuarioAtualizado) => api.put(`/controle-usuario/${id}`, usuarioAtualizado);
export const removerUsuario = id => api.delete(`/controle-usuario/${id}`);
export const encUsuarioPorID = id => api.get(`/controle-usuario/${id}`);

const apis = {
    inserirUsuario,
    listarUsuarios,
    atualizarUsuario,
    removerUsuario,
    encUsuarioPorID,
}

export default apis;
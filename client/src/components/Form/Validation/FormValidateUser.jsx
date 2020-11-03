import api from '../../../api';

const checkEmailOnDatabase = async (email) => {
    const response = await api.encUsuarioPorEmail(email);
    return response.data.success;
}

export default function validate(values, editing) {
    let erros = {};

    // Validar nome
    if (!values.nome || values.nome.length < 4) {
        erros.nome = "Nome muito curto."
    }

    if (!editing && checkEmailOnDatabase(values.email)) {
        erros.email = "E-mail já em uso por outro usuário."
    }

    // Validar e-mail
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
        erros.email = "E-mail inválido."
    }

    // Validar acesso
    if (values.acesso === "") {
        erros.acesso = "Tipo de acesso inválido."
    }

    // Validar disciplina
    if (values.acesso === "Professor") {
        if (!values.disciplina.length) {
            erros.disciplina = "Professores precisam estar relacionados com ao menos uma disciplina."
        }
    }

    // Validar senha
    if (!values.senha || values.senha.length < 6) {
        erros.senha = "A senha deve conter ao menos 6 caracteres.";
    }

    else {
        erros.validated = true
    }

    return erros;
}
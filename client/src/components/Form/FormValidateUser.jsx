export default function validate(values) {
    let erros = {};

    // Validar nome
    if (!values.nome || values.nome.length < 4) {
        erros.nome = "Nome muito curto."
    }

    // Validar e-mail
    if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
        erros.email = "E-mail inválido."
    }

    // Validar acesso
    if (values.acesso === "") {
        erros.acesso = "Tipo de acesso inválido."
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
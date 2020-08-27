export default function validate(values) {
    let erros = {};

    // Validar disciplina
    if (values.disciplina === "") {
        erros.disciplina = "Uma disciplina deve ser selecionada."
    }

    // Validar area de conhecimento
    if (values.area === "") {
        erros.area = "Uma área de conhecimento deve ser selecionada."
    }

    // Validar numeracao
    if (values.numeracao === "") {
        erros.numeracao = "A numeração deve ser preenchida."
    }

    // Validar topico
    if (values.topico === "") {
        erros.topico = "O tópico deve ser preenchido."
    }

    else {
        erros.validated = true
    }

    return erros;
}
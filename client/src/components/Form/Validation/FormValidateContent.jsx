export default function validate(values) {
    let erros = {};

    // Validar disciplina
    if (values.disciplinaID === "") {
        erros.disciplina = "A disciplina deve ser selecionada."
    }

    // Validar area de conhecimento
    if (values.area === "") {
        erros.area = "A área de conhecimento deve ser selecionada."
    }

    // Validar numeracao
    if (values.numeracao === "") {
        erros.numeracao = "A numeração deve ser preenchida."
    }

    // Validar videoAulaURL
    if (values.videoAulaURL === "") {
        erros.videoAulaURL = "Um link para videoaula deve ser fornecido."
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
export default function validate (props) {
    const {disciplinaID, topicoID, enunciado, tipoResposta, resposta} = props;
    let erros = {};

    // Validar disciplina
    if (disciplinaID === '') {
        erros.disciplina = "É preciso escolher uma disciplina."
        erros.validated = false;
    }

    // Validar topico
    if (topicoID === '') {
        erros.topico = "É preciso escolher um tópico."
        erros.validated = false;
    }

    // Validar enunciado
    if (enunciado === '') {
        erros.enunciado = "É preciso inserir o enunciado da questão."
        erros.validated = false;
    }

    // Validar respostas em caso de questão múltipla-escolha
    if (tipoResposta === "multiplaEscolha" && resposta.length < 2) {
        erros.resposta = "Insira ao menos duas respostas para a questão."
        erros.validated = false;
    }

    if (erros.validated !== false) {
        erros.validated = true;
    }

    return erros;
}
export default function validate (props) {
    const {disciplina, topico, enunciado, tipoResposta, resposta} = props;
    let erros = {};

    // Validar disciplina
    if (disciplina.nome === '') {
        erros.disciplina = "É preciso escolher uma disciplina."
        erros.validated = false;
    }

    // Validar topico
    if (topico.nome === '') {
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
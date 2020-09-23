export default function validate (props) {
    const {disciplinaID, topicoID, numeracao, areaConhecimento, tipoAtividade, questoes} = props;
    let revisao = tipoAtividade !== "Avaliação Diagnóstica" ? true : false;
    let erros = {};

    // Validar disciplina
    if (disciplinaID === '' && revisao) {
        erros.disciplina = "É preciso escolher uma disciplina."
        erros.validated = false;
    }

    // Validar topico
    if (topicoID === '' && revisao) {
        erros.topico = "É preciso escolher um tópico."
        erros.validated = false;
    }

    // Validar areaConhecimento
    if (areaConhecimento === '' && !revisao) {
        erros.areaConhecimento = "É preciso escolher uma área do conhecimento."
        erros.validated = false;
    }

    // Validar numeracao
    if (numeracao === '' && !revisao) {
        erros.numeracao = "É preciso escolher a numeração."
        erros.validated = false;
    }

    // Validar tipoAtividade
    if (tipoAtividade === '') {
        erros.tipoAtividade = "É preciso escolher um tipo de atividade."
        erros.validated = false;
    }

    // Validar questoes
    if (!questoes.length) {
        erros.questoes = "É preciso escolher as questões."
        erros.validated = false;
    }

    if (erros.validated !== false) {
        erros.validated = true;
    }

    return erros;
}
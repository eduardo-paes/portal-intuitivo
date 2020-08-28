import React, { useContext, useState, useEffect } from "react";
import api from '../../api'
import { StoreContext } from "../../utils";
import QuestionForm from "../../components/Form/QuestionForm";
import validate from "../../components/Form/Validation/FormValidateQuestion";

// -- Função Principal
function QuestionUpdate(props) {
    // -- Dados iniciais da constante Questão
    const initialQuestionState = {
        id: props.match.params.id,
        disciplina: "",
        topico: "",
        enunciado: "",
        resposta: [],
        tipoResposta: "multiplaEscolha",
        dataCriacao: new Date(),
        dataEdicao: new Date(),
        erros: []
    }

    // -- Dados iniciais da constante Opções
    const initialOptionState = {
        opcao: "", 
        gabarito: false
    }

    const [disciplina, setDisciplina] = useState([]);
    const [questao, setQuestao] = useState(initialQuestionState);
    const [opcoes, setOpcoes] = useState([initialOptionState]);
    const {token} = useContext(StoreContext);

    // -- Carrega as Disciplinas existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchDisciplinaAPI() {
            const response = await api.listarDisciplinas();
            const value = response.data.data;
            setDisciplina(value);
        }
        fetchDisciplinaAPI()
        return abortController.abort();
    }, []);

    // -- Confirma mudanças realizadas em opcoes
    useEffect(() => {
        setOpcoes(opcoes);
    }, [opcoes]);

    // -- Salva questão no banco de dados
    async function saveQuestion() {
        const {disciplina, topico, enunciado, resposta, tipoResposta, dataCriacao, dataEdicao} = questao;
        
        // Valida se há algum erro no preenchimento dos campos
        const error = validate(questao);
        setQuestao(preValue => ({
            ...preValue,
            erros: error
        }))
        // Verifica se há erro
        if (error.validated) {
            if (tipoResposta === "multiplaEscolha") {
                var respostaValidada = resposta.filter(item => {
                    return item.opcao !== "";
                })
            }

            const novaQuestao = {
                disciplina,
                topico,
                enunciado,
                resposta: respostaValidada,
                tipoResposta,
                dataCriacao,
                dataEdicao,
                autor: token.userID
            }
        
            // Inserção pela API
            await api
                .inserirQuestao(novaQuestao)
                .then(res => {
                    // Limpa os campos
                    if (res.status === 201) {
                        setQuestao(initialQuestionState);
                        setOpcoes([initialOptionState]);
                    }
                })
        }
    }

    return (
        <QuestionForm 
            title="Criar Questão"
            disciplina={disciplina}
            questao={questao}
            setQuestao={setQuestao}
            saveQuestion={saveQuestion}
            opcoes={opcoes}
            setOpcoes={setOpcoes}
            initialOptionState={initialOptionState}
        />
    );
};

export default QuestionUpdate;
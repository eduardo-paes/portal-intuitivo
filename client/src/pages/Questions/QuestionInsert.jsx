import React, { useContext, useState, useEffect } from "react";
import api from '../../api'
import { StoreContext } from "../../utils";
import QuestionForm from "../../components/Form/QuestionForm";
import validate from "../../components/Form/Validation/FormValidateQuestion";

// -- Função Principal
function QuestionInsert() {
    // -- Dados iniciais da constante Questão
    const initialQuestionState = {
        disciplina: {
            id: "",
            nome: ""
        },
        topico: {
            id: "",
            nome: ""
        },
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

    const [listaDisciplinas, setListaDisciplinas] = useState([]);
    const [questao, setQuestao] = useState(initialQuestionState);
    const [opcoes, setOpcoes] = useState([initialOptionState]);
    const {token} = useContext(StoreContext);

    // -- Carrega as Disciplinas existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchDisciplinaAPI() {
            const response = await api.listarDisciplinas();
            const value = response.data.data;
            setListaDisciplinas(value);
        }
        fetchDisciplinaAPI()
        return abortController.abort();
    }, []);

    // -- Confirma mudanças realizadas em opcoes
    useEffect(() => {
        setOpcoes(opcoes);
    }, [opcoes]);

    // -- Confirma mudanças realizadas em questao
    useEffect(() => {
        setQuestao(questao);
    }, [questao]);

    // -- Salva questão no banco de dados
    async function saveQuestion() {
        // Valida se há algum erro no preenchimento dos campos
        const error = validate(questao);
        setQuestao(preValue => ({
            ...preValue,
            erros: error
        }))
        
        // Verifica se há erro
        if (error.validated) {
            const {disciplina, topico, enunciado, resposta, tipoResposta, dataCriacao, dataEdicao} = questao;

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
                        window.alert("Questão inserida com sucesso.")
                        setQuestao(initialQuestionState);
                        setOpcoes([initialOptionState]);
                    }
                })
        }
    }

    return (
        <QuestionForm 
            title="Criar Questão"
            listaDisciplinas={listaDisciplinas}
            questao={questao}
            setQuestao={setQuestao}
            saveQuestion={saveQuestion}
            opcoes={opcoes}
            setOpcoes={setOpcoes}
            initialOptionState={initialOptionState}
        />
    );
};

export default QuestionInsert;
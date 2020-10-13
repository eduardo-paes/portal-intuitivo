import React, { useContext, useState, useEffect } from "react";
import api from '../../api'
import { StoreContext } from "../../utils";
import { QuestionForm } from "../../components";
import validate from "../../components/Form/Validation/FormValidateQuestion";

// -- Função Principal
export default function QuestionInsert() {
    // -- Dados iniciais da constante Questão
    const initialQuestionState = {
        disciplinaID: "",
        topicoID: "",
        enunciado: "",
        resposta: [],
        tipoResposta: "multiplaEscolha",
        dataCriacao: new Date(),
        dataEdicao: new Date(),
        padraoResposta: "",
        tags: [],
        erros: []
    }

    // -- Dados iniciais da constante Opções
    const initialOptionState = {
        opcao: "", 
        gabarito: false
    }

    const [questao, setQuestao] = useState(initialQuestionState);
    const [opcoes, setOpcoes] = useState([initialOptionState]);
    const {token} = useContext(StoreContext);

    // -- Confirma mudanças realizadas em opcoes
    useEffect(() => {
        const abortController = new AbortController();
        setOpcoes(opcoes);
        return abortController.abort();
    }, [opcoes]);

    // -- Confirma mudanças realizadas em questao
    useEffect(() => {
        const abortController = new AbortController();
        setQuestao(questao);
        return abortController.abort();
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
            const {disciplinaID, topicoID, enunciado, resposta, tipoResposta, dataCriacao, dataEdicao, padraoResposta, tags} = questao;

            if (tipoResposta === "multiplaEscolha") {
                var respostaValidada = resposta.filter(item => {
                    return item.opcao !== "";
                })
            }

            const novaQuestao = {
                disciplinaID,
                topicoID,
                enunciado,
                resposta: respostaValidada,
                tipoResposta,
                dataCriacao,
                dataEdicao,
                padraoResposta,
                tags,
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
            questao={questao}
            setQuestao={setQuestao}
            saveQuestion={saveQuestion}
            opcoes={opcoes}
            setOpcoes={setOpcoes}
            initialOptionState={initialOptionState}
        />
    );
};
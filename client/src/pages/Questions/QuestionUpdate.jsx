import React, { useState, useEffect } from "react";
import api from '../../api'
import { QuestionForm } from "../../components";
import validate from "../../components/Form/Validation/FormValidateQuestion";

// -- Função Principal
export default function QuestionUpdate(props) {
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
    const questaoID = props.match.params.id;
    
    // -- Carrega questão selecionada pelo usuário
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchQuestaoAPI() {
            const response = await api.encQuestaoPorID(questaoID);
            const value = response.data.data;
            let tags = [];
            
            // Puxa as Tags do banco
            if (value.tags.length > 0) {
                const resTags = await api.listarTQPorQuestaoID(questaoID);
                const resValue = resTags.data.data;
                
                resValue.map(tagFound => {
                    return tags.push(tagFound.tagID)
                })
            }

            setQuestao(preValue => ({
                ...preValue,
                disciplinaID: value.disciplinaID,
                topicoID: value.topicoID,
                enunciado: value.enunciado,
                resposta: value.resposta,
                tipoResposta: value.tipoResposta,
                dataCriacao: value.dataCriacao,
                dataEdicao: value.dataEdicao,
                tags: tags,
                erros: []
            }));

            if (value.tipoResposta === "multiplaEscolha") {
                setOpcoes(value.resposta)
            }
        }
        fetchQuestaoAPI()
        return abortController.abort();
    }, [questaoID]);

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
    async function updateQuestion() {
        // Valida se há algum erro no preenchimento dos campos
        const error = validate(questao);
        setQuestao(preValue => ({
            ...preValue,
            erros: error
        }))
        
        // Verifica se há erro
        if (error.validated) {
            const {disciplinaID, topicoID, enunciado, resposta, tipoResposta, dataCriacao, padraoResposta, tags, autor} = questao;

            if (tipoResposta === "multiplaEscolha") {
                var respostaValidada = resposta.filter(item => {
                    return item.opcao !== "";
                })
            }

            const questaoAtualizada = {
                disciplinaID,
                topicoID,
                enunciado,
                resposta: respostaValidada,
                tipoResposta,
                dataCriacao,
                dataEdicao: new Date(),
                padraoResposta,
                tags,
                autor
            }

            // Inserção pela API
            await api
                .atualizarQuestao(props.match.params.id, questaoAtualizada)
                .then(res => {
                    // Limpa os campos
                    if (res.status === 200) {
                        window.alert("Questão atualizada com sucesso.")
                    }
                })
        }
    }

    return (
        <QuestionForm 
            title="Criar Questão"
            questao={questao}
            setQuestao={setQuestao}
            saveQuestion={updateQuestion}
            opcoes={opcoes}
            setOpcoes={setOpcoes}
            initialOptionState={initialOptionState}
        />
    );
};
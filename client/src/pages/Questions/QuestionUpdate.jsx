import React, { useState, useEffect } from "react";
import api from '../../api'
import { QuestionForm } from "../../components";
import validate from "../../components/Form/Validation/FormValidateQuestion";

// -- Função Principal
function QuestionUpdate(props) {
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

    const questionID = props.match.params.id;
    const [listaDisciplinas, setListaDisciplinas] = useState([]);
    const [questao, setQuestao] = useState(initialQuestionState);
    const [opcoes, setOpcoes] = useState([initialOptionState]);
    
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

    // -- Carrega questão selecionada pelo usuário
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchQuestaoAPI() {
            const response = await api.encQuestaoPorID(questionID);
            const value = response.data.data;
            setQuestao(preValue => ({
                ...preValue,
                disciplina: {
                    id: value.disciplina.id,
                    nome: value.disciplina.nome
                },
                topico: {
                    id: value.topico.id,
                    nome: value.topico.nome,
                },
                enunciado: value.enunciado,
                resposta: value.resposta,
                tipoResposta: value.tipoResposta,
                dataCriacao: value.dataCriacao,
                dataEdicao: value.dataEdicao,
                erros: []
            }));
            if (value.tipoResposta === "multiplaEscolha") {
                setOpcoes(value.resposta)
            }
        }
        fetchQuestaoAPI()
        return abortController.abort();
    }, [questionID]);

    // -- Confirma mudanças realizadas em opcoes
    useEffect(() => {
        setOpcoes(opcoes);
    }, [opcoes]);

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
            const {disciplina, topico, enunciado, resposta, tipoResposta, dataCriacao, autor} = questao;

            if (tipoResposta === "multiplaEscolha") {
                var respostaValidada = resposta.filter(item => {
                    return item.opcao !== "";
                })
            }

            const questaoAtualizada = {
                disciplina,
                topico,
                enunciado,
                resposta: respostaValidada,
                tipoResposta,
                dataCriacao,
                dataEdicao: new Date(),
                autor
            }

            // Inserção pela API
            await api
                .atualizarQuestao(questionID, questaoAtualizada)
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

export default QuestionUpdate;
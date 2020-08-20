import React, { useContext, useState, useEffect } from "react";
import api from '../../api'
import { StoreContext } from "../../utils";
import QuestionForm from "../../components/Form/QuestionForm";

// -- Dados iniciais da constante Questão
const initialQuestionState = {
    disciplina: "",
    topico: "",
    enunciado: "",
    resposta: [],
    tipoResposta: "multiplaEscolha",
    dataCriacao: new Date(),
    dataEdicao: new Date(),
    autor: ""
}

// -- Dados iniciais da constante Opções
const initialOptionState = {
    opcao: "", 
    gabarito: false
}

// -- Função Principal
function QuestionInsert() {
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
    }, [disciplina]);

    // -- Salva questão no banco de dados
    async function saveQuestion() {
        setQuestao(preValue => ({
            ...preValue,
            autor: token.userID,
            resposta: opcoes
        }))

        console.log(questao)
        setQuestao(initialQuestionState);
        setOpcoes([initialOptionState]);

        // await api
        //     .inserirQuestao(questao)
        //     .then(res => {
        //         // Limpa os campos
        //         if (res.status === 201) {
        //             setQuestao(initialQuestionState);
        //             setOpcoes([initialOptionState]);
        //         }
        //     })
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

export default QuestionInsert;
import React, { useState, useContext } from "react";
import { StoreContext } from "../../utils"
import { ActivityValidater } from "../../components";
import api from '../../api'

// -- Estilos
import { ActivityForm } from "../../components/";

export default function ActivityInsert() {
    // -- Dados iniciais da constante Atividade
    const initialState = {
        tipoAtividade: "",
        disciplina: {
            id: "",
            nome: ""
        },
        areaConhecimento: "",
        numeracao: "",
        topico: {
            id: "",
            nome: ""
        },
        questoes: [],
        dataCriacao: new Date(),
        dataModificacao: new Date(),
        autor: "",
        erros: []
    }

    const [atividade, setAtividade] = useState(initialState);
    const {token} = useContext(StoreContext);

    // -- Salva as alterações feitas no banco*
    async function saveActivity() {
        // Caso seja uma Avaliação Diagnóstica, não está relacionada com uma disciplina
        const error = ActivityValidater(atividade);
        setAtividade(preValue => ({
            ...preValue,
            erros: error
        }));

        // Verifica se há erro
        if (error.validated) {
            const { disciplina, topico, tipoAtividade, questoes, areaConhecimento, dataCriacao } = atividade;
            
            const novaAtividade = {
                disciplina,
                topico,
                tipoAtividade,
                questoes,
                areaConhecimento,
                dataCriacao,
                dataModificacao: new Date(),
                autor: token.userID,
            }

            // Inserção pela API
            await api
                .inserirAtividade(novaAtividade)
                .then(res => {
                    // Limpa os campos
                    if (res.status === 201) {
                        window.alert("Atividade inserida com sucesso.")
                        setAtividade(initialState);
                    }
                })
        }
    }

    return (
        <ActivityForm 
            atividade={atividade}
            setAtividade={setAtividade}
            initialState={initialState}
            saveActivity={saveActivity}
            saveRevision={ActivityValidater}
        />
    );
};
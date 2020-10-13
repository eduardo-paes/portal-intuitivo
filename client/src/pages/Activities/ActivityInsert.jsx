import React, { useState, useContext } from "react";
import { StoreContext } from "../../utils"
import { ActivityValidater } from "../../components";
import api from '../../api'

// -- Estilos
import { ActivityForm } from "../../components/";

// -- Dados iniciais da constante Atividade
const initialState = {
    tipoAtividade: "",
    disciplinaID: "",
    areaConhecimento: "",
    numeracao: "",
    topicoID: "",
    questoes: [],
    dataCriacao: new Date(),
    dataModificacao: new Date(),
    autor: "",
    erros: []
}

export default function ActivityInsert() {
    const [atividade, setAtividade] = useState(initialState);
    const [clear, setClear] = useState(false);
    const {token} = useContext(StoreContext);

    // -- Salva as alterações feitas no banco*
    async function inserirAtividade() {
        // Validação de erros
        const error = ActivityValidater(atividade);
        setAtividade(preValue => ({
            ...preValue,
            erros: error
        }));

        // Verifica se há erro
        if (error.validated) {
            const { disciplinaID, topicoID, tipoAtividade, questoes, areaConhecimento, dataCriacao } = atividade;
            
            const novaAtividade = {
                disciplinaID,
                topicoID,
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
                        setClear(true);
                    }
                })
        }
    }

    // -- Salva as alterações feitas no banco*
    async function inserirRevisao() {
        // Validação de erros
        const error = ActivityValidater(atividade);
        setAtividade(preValue => ({
            ...preValue,
            erros: error
        }));

        // Verifica se há erro
        if (error.validated) {
            const { tipoAtividade, questoes, areaConhecimento, numeracao, dataCriacao } = atividade;
            
            const novaRevisao = {
                tipoAtividade,
                areaConhecimento,
                numeracao,
                questoes,
                dataCriacao,
                dataModificacao: new Date(),
                autor: token.userID,
            }

            // console.log(novaRevisao);

            // Inserção pela API
            await api
                .inserirRevisao(novaRevisao)
                .then(res => {
                    // Limpa os campos
                    if (res.status === 201) {
                        window.alert("Avaliação Diagnóstica inserida com sucesso.")
                        setAtividade(initialState);
                        setClear(true);
                    }
                })
        }
    }

    return (
        <ActivityForm 
            atividade={atividade}
            setAtividade={setAtividade}
            initialState={initialState}
            saveActivity={inserirAtividade}
            saveRevision={inserirRevisao}
            isRevision={false}
            clear={clear}
        />
    );
};
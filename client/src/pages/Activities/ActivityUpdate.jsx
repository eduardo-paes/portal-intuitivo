import React, { useState, useContext } from "react";
import { StoreContext } from "../../utils"

// -- Estilos
import { ActivityForm } from "../../components/";

export default function ActivityUpdate(props) {
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
        autor: ""
    }

    const [atividade, setAtividade] = useState(initialState);
    const {token} = useContext(StoreContext);

    // -- Salva as alterações feitas no banco*
    const saveChange = () => {
        // Caso seja uma Avaliação Diagnóstica, não está relacionada com uma disciplina
        if (atividade.tipo === "revisao") {
            setAtividade(preValue => ({
                ...preValue,
                disciplina: "",
                topico: "",
                autor: token.userID,
                dataModificacao: new Date(),
            }));
        } else {
            setAtividade(preValue => ({
                ...preValue,
                autor: token.userID,
                dataModificacao: new Date(),
            }));
        }
    }

    return (
        <ActivityForm 
            atividade={atividade}
            setAtividade={setAtividade}
            initialState={initialState}
            saveChange={saveChange}
            saveRevision={saveChange}
        />
    );
};
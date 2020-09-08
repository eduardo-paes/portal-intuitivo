import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../utils"
import { ActivityValidater } from "../../components";
import api from '../../api'

// -- Estilos
import { ActivityForm } from "../../components/";

// -- Dados iniciais da constante Atividade/Revisão
const initialState = {
    tipoAtividade: "",
    areaConhecimento: "",
    numeracao: "",
    disciplina: {
        id: "",
        nome: ""
    },
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

export default function ActivityUpdate(props) {
    const [atividade, setAtividade] = useState(initialState);
    const {token} = useContext(StoreContext);
    const isRevision = props.history.location.pathname.includes("revisao");     // Verifica se é uma atividade do tipo Revisão
    
    // -- Carrega atividade do banco
    async function fetchAtividadeAPI() {
        const response = await api.encAtividadePorID(props.match.params.id);
        const value = response.data.data;
        setAtividade(preValue => ({
            ...preValue,
            tipoAtividade: value.tipoAtividade,
            areaConhecimento: value.areaConhecimento,
            disciplina: {
                id: value.disciplina.id,
                nome: value.disciplina.nome
            },
            topico: {
                id: value.topico.id,
                nome: value.topico.nome,
            },
            questoes: value.questoes,
            dataCriacao: value.dataCriacao,
            dataModificacao: value.dataModificacao,
            autor: value.autor,
            erros: []
        }));
    }

    // -- Carrega revisão do banco
    async function fetchRevisaoAPI() {
        const response = await api.encRevisaoPorID(props.match.params.id);
        const value = response.data.data;
        setAtividade(preValue => ({
            ...preValue,
            tipoAtividade: value.tipoAtividade,
            areaConhecimento: value.areaConhecimento,
            numeracao: value.numeracao,
            questoes: value.questoes,
            dataCriacao: value.dataCriacao,
            dataModificacao: value.dataModificacao,
            autor: value.autor,
            erros: []
        }));
    }

    // -- Carrega atividade ou revisão selecionada pelo usuário
    useEffect(() => {
        const abortController = new AbortController();
        if (isRevision) {
            fetchRevisaoAPI();
        } else {
            fetchAtividadeAPI();
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, []);

    // -- Salva as alterações feitas no banco*
    async function atualizarAtividade() {
        // Validação de erros
        const error = ActivityValidater(atividade);
        setAtividade(preValue => ({
            ...preValue,
            erros: error
        }));

        // Verifica se há erro
        if (error.validated) {
            const { disciplina, topico, tipoAtividade, questoes, areaConhecimento, dataCriacao } = atividade;
            
            const atividadeAtualizada = {
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
                .atualizarAtividade(props.match.params.id, atividadeAtualizada)
                .then(res => {
                    // Limpa os campos
                    if (res.status === 200) {
                        window.alert("Atividade atualizada com sucesso.")
                    }
                })
        }
    }

    // -- Salva as alterações feitas no banco*
    async function atualizarRevisao() {
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

            // Atualização pela API
            await api
                .atualizarRevisao(props.match.params.id, novaRevisao)
                .then(res => {
                    // Limpa os campos
                    if (res.status === 200) {
                        window.alert("Avaliação Diagnóstica atualizada com sucesso.")
                    }
                })
        }
    }

    return (
        <ActivityForm 
            atividade={atividade}
            setAtividade={setAtividade}
            initialState={initialState}
            saveActivity={atualizarAtividade}
            saveRevision={atualizarRevisao}
            isRevision={isRevision}
            clear={false}
        />
    );
};
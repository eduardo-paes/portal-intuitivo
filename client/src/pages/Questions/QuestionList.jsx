import React, { useState, useEffect } from "react";
import api from '../../api'

// -- Components
import { MyContainer, CreateButton, GeneralTitle } from "../../assets/styles/styledComponents"
import { QuestionTable, QuestionDialog } from "../../components"

// -- Styles
import "./ListStyles.css"

function QuestionInsert() {
    const [questoes, setQuestoes] = useState([]);
    const [questaoSelecionada, setQuestaoSelecionada] = useState('');
    const [hiddenDialog, setHiddenDialog] = useState(false);
    const [mount, setMount] = useState({
        isMounted: true,
        wasChanged: false
    })

    async function fetchQuestoesAPI() {
        const response = await api.listarQuestao();
        const value = response.data.data;
        setQuestoes(value);
    }

    // -- Lista as questões do banco
    useEffect(() => {
        const abortController = new AbortController();
        if (mount.isMounted) {
            fetchQuestoesAPI()
            setMount(preValue => ({ ...preValue, isMounted:false }));
        }
        return abortController.abort();
    // eslint-disable-next-line
    }, []);

    // -- Lista as questões do banco
    useEffect(() => {
        const abortController = new AbortController();
        if (mount.wasChanged) {
            fetchQuestoesAPI()
            setMount(preValue => ({ ...preValue, wasChanged:false }));
        }
        return abortController.abort();
    }, [mount]);

    // -- Observa mudanças em questão selecionada
    useEffect(() => {
        setQuestaoSelecionada(questaoSelecionada)
    }, [questaoSelecionada]);

        return (
        <MyContainer>
            <section id="cabecalhoQuestao">
                <GeneralTitle>Banco de Questões</GeneralTitle>
            </section>

            <section id="tabelaQuestao">
                <QuestionTable 
                    data={questoes} 
                    setMount={setMount} 
                    setQuestion={setQuestaoSelecionada} 
                    setHidden={setHiddenDialog} 
                    tableSelection={false}/>

                <QuestionDialog 
                    enunciado={questaoSelecionada.enunciado}
                    tipoResposta={questaoSelecionada.tipoResposta}
                    resposta={questaoSelecionada.resposta}
                    open={hiddenDialog}
                    setOpen={setHiddenDialog}
                />
            </section>

            <section id="rodapeQuestao">
                <div className="create-button">
                    <CreateButton title="Inserir Questão" url="/controle-questoes/create"/>
                </div>
            </section>
        </MyContainer>
    );
};

export default QuestionInsert;
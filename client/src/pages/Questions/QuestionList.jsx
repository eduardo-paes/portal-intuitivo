import React, { useState, useEffect } from "react";
import api from '../../api'

// -- Styles
// import { Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

// -- Components
import { MyContainer, CreateButton, MyCard, MyCardContent } from "../../assets/styles/styledComponents"
import { QuestionTable } from "../../components"

// -- Local Styles
const useStyles = makeStyles((theme) => ({
    cardQuestion: {
        marginTop: "1rem",
        maxWidth: "500px",
        alignSelf: "center",
        alignItems: "center",
        alignText: "center"
    }, 
    cardList: {
        alignItems: "center",
        alignText: "center"
    }
}));

function DecodeFromHTML (value) {

    const parser = new DOMParser();
    const decodedString = parser.parseFromString(`<!doctype html><body>${value}`, 'text/html').body.textContent;
    console.log(decodedString);
}


function QuestionInsert() {
    const classes = useStyles();
    const [questoes, setQuestoes] = useState([]);
    const [questaoSelecionada, setQuestaoSelecionada] = useState('');

    // -- Lista as questões do banco
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchQuestoesAPI() {
            const response = await api.listarQuestao();
            const value = response.data.data;
            setQuestoes(value);
        }
        fetchQuestoesAPI()
        return abortController.abort();
    }, [questoes]);

    // -- Observa mudanças em questão selecionada
    useEffect(() => {
        console.log(questaoSelecionada)
        setQuestaoSelecionada(questaoSelecionada)
        DecodeFromHTML(questaoSelecionada.enunciado)
    }, [questaoSelecionada]);

        return (
        <MyContainer>
            <section id="cabecalhoListaQuestao">
                <h1 className="heading-page">Banco de Questões</h1>
                <QuestionTable data={questoes} setQuestion={setQuestaoSelecionada}/>
                <CreateButton title="Inserir Questão" url="/controle-questoes/create"/>
            </section>

            <section id="cardsListaQuestao" className={classes.cardList} hidden={questaoSelecionada === '' ? true : false}>
                <MyCard className={classes.cardQuestion}>
                    <MyCardContent>
                        <div dangerouslySetInnerHTML={{__html: questaoSelecionada.enunciado}} />
                        { questaoSelecionada.tipoResposta === "multiplaEscolha" 
                            && questaoSelecionada.resposta.map((item, index) => {
                                return (<div key={index} dangerouslySetInnerHTML={{__html: item.opcao}} />);
                            })
                        }
                    </MyCardContent>
                </MyCard>
            </section>
        </MyContainer>
    );
};

export default QuestionInsert;
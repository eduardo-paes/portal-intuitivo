import React, { useState, useEffect } from "react";
import api from '../../api'

// -- Components
import { MyContainer, CreateButton } from "../../assets/styles/styledComponents"
import { QuestionTable, QuestionCard } from "../../components"
import { Card, Grid } from "@material-ui/core";

// -- Styles
import { makeStyles } from '@material-ui/core/styles';
import "./ListStyles.css"

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    }
}));

function QuestionInsert() {
    const classes = useStyles();
    const [questoes, setQuestoes] = useState([]);
    const [questaoSelecionada, setQuestaoSelecionada] = useState('');
    const [hiddenCard, setHiddenCard] = useState(true);

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
        setQuestaoSelecionada(questaoSelecionada)
    }, [questaoSelecionada]);

        return (
        <MyContainer>
            <h1 className="heading-page">Banco de Questões</h1>
            <Grid container={true} className={classes.root} spacing={2}>

                <Grid id="cabecalhoListaQuestao" item={true} xs={12} sm={hiddenCard ? 12 : 6} lg={hiddenCard ? 12 : 6} justify="center" spacing={2}>
                    <QuestionTable data={questoes} setQuestion={setQuestaoSelecionada} setHidden={setHiddenCard}/>
                    <CreateButton title="Inserir Questão" url="/controle-questoes/create"/>
                </Grid>

                <Grid id="cardsListaQuestao" item={true} xs={12} sm={hiddenCard ? 12 : 6} lg={hiddenCard ? 12 : 6} justify="center" spacing={2}>
                    <Card id="questaoCard" hidden={hiddenCard}>
                        <QuestionCard 
                            enunciado={questaoSelecionada.enunciado}
                            tipoResposta={questaoSelecionada.tipoResposta}
                            resposta={questaoSelecionada.resposta}
                        />
                    </Card>
                </Grid>
            </Grid>
        </MyContainer>
    );
};

export default QuestionInsert;
import React, { useState, useEffect } from "react";
import api from '../../api'

// -- Components
import { MyContainer, CreateButton } from "../../assets/styles/styledComponents"
import { QuestionTable, CustomDialog } from "../../components"
import { Grid } from "@material-ui/core";

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
    const [hiddenDialog, setHiddenDialog] = useState(false);

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
            <Grid container={true} className={classes.root} spacing={2} justify="center">
                <Grid id="cabecalhoListaQuestao" item={true} xs={12} sm={12} lg={12}>
                    <QuestionTable data={questoes} setQuestion={setQuestaoSelecionada} setHidden={setHiddenDialog} tableSelection={false}/>
                    <CreateButton title="Inserir Questão" url="/controle-questoes/create"/>
                </Grid>
            </Grid>

            <CustomDialog 
                enunciado={questaoSelecionada.enunciado}
                tipoResposta={questaoSelecionada.tipoResposta}
                resposta={questaoSelecionada.resposta}
                open={hiddenDialog}
                setOpen={setHiddenDialog}
            />

        </MyContainer>
    );
};

export default QuestionInsert;
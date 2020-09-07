import React, { useState, useEffect } from "react";
import api from '../../api'

// -- Estilos
import { MyContainer, CreateButton } from "../../assets/styles/styledComponents"
import { makeStyles } from '@material-ui/core/styles';
import { ActivityTable } from "../../components";
import { Grid, Button, ButtonGroup } from '@material-ui/core';

// -- Local Styles
const useStyles = makeStyles((theme) => ({
    activityMode: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
}));

export default function ActivityList() {
    const classes = useStyles();
    const [atividades, setAtividades] = useState([]);
    const [revisoes, setRevisoes] = useState([]);
    const [revision, setRevision] = useState(false);

    async function fetchAtividadesAPI() {
        const response = await api.listarAtividades();
        if (response.status === 200) {
            setAtividades(response.data.data);
        }
    }

    async function fetchRevisoesAPI() {
        const response = await api.listarRevisao();
        if (response.status === 200) {
            setRevisoes(response.data.data);
        }
    }

    // -- Lista as atividades do banco
    useEffect(() => {
        const abortController = new AbortController();
        if (!revision) {
            fetchAtividadesAPI()
        }
        return abortController.abort();
    }, [atividades, revision]);

    // -- Lista as revisões do banco
    useEffect(() => {
        const abortController = new AbortController();
        if (revision) {
            fetchRevisoesAPI()
        }
        return abortController.abort();
    }, [revisoes, revision]);

    return (
        <MyContainer>
            <section id="cabecalhoListaAtividade">
                <Grid container={true}>
                    <Grid item={true} xs={12} sm={6} lg={6}>
                        <h1 className="heading-page">Atividades</h1>
                    </Grid>
                    <Grid item={true} xs={12} sm={6} lg={6} className={classes.activityMode}>
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                            <Button onClick={() => setRevision(true)}>ADs</Button>
                            <Button onClick={() => setRevision(false)}>Atividades</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </section>

            <section id="dadosListaAtividades">
                <Grid container={true} spacing={2} justify="center">
                    <Grid  item={true} xs={12} sm={12} lg={12}>
                        <ActivityTable data={revision ? revisoes : atividades} revision={revision}/>
                        <CreateButton title="Inserir Atividade" url="/controle-atividade/create"/>
                    </Grid>
                </Grid>
            </section>

        </MyContainer>
    );
};
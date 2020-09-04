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

export default function AcitivityList() {
    const classes = useStyles();
    const [atividades, setAtividades] = useState([]);
    const [revision, setRevision] = useState(false);

    // -- Lista as atividades do banco
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchAtividadesAPI() {
            const response = await api.listarAtividades();
            if (response.status === 200) {
                setAtividades(response.data.data);
            }
        }
        fetchAtividadesAPI()
        return abortController.abort();
    }, [atividades]);

    return (
        <MyContainer>
            <Grid container={true}>
                <Grid item={true} xs={12} sm={6} lg={6}>
                    <h1 className="heading-page">Atividades</h1>
                </Grid>
                <Grid item={true} xs={12} sm={6} lg={6} className={classes.activityMode}>
                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        <Button onClick={() => setRevision(!revision)}>ADs</Button>
                        <Button onClick={() => setRevision(false)}>Atividades</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>

            <Grid container={true} spacing={2} justify="center">
                <Grid id="cabecalhoListaAtividade" item={true} xs={12} sm={12} lg={12}>
                    <ActivityTable data={atividades} revision={revision}/>
                    <CreateButton title="Inserir Atividade" url="/controle-atividades/create"/>
                </Grid>
            </Grid>

        </MyContainer>
    );
};
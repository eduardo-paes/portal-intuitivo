import React, { useState, useEffect } from "react";
import api from '../../api'

// -- Estilos
import { MyContainer, CreateButton, GeneralTitle } from "../../assets/styles/styledComponents"
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

    const [mount, setMount] = useState({
        activity: {
            isMounted: true,
            wasChanged: false
        },
        revision: {
            isMounted: true,
            wasChanged: false
        }
    })

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
        fetchAtividadesAPI()
        return abortController.abort();
    }, []);

    // -- Atualização apartir de montagem
    useEffect(() => {
        const abortController = new AbortController();
        if (mount.revision.wasChanged) {
            fetchRevisoesAPI();
            setMount(preValue => ({
                ...preValue, 
                revision: { 
                    isMounted: mount.revision.isMounted, 
                    wasChanged: false
                }
            }));
        }
        if (mount.activity.wasChanged) {
            fetchAtividadesAPI();
            setMount(preValue => ({
                ...preValue, 
                activity: { 
                    isMounted: mount.activity.isMounted, 
                    wasChanged: false
                }
            }));
        } 
        return abortController.abort();
    }, [mount]);

    // -- Lista as revisões do banco
    const initialRevisionLoad = () => {
        setRevision(true);
        if (mount.revision.isMounted) {
            fetchRevisoesAPI()
            setMount(preValue => ({
                ...preValue, 
                revision: { 
                    isMounted: false, 
                    wasChanged: mount.revision.wasChanged 
                }
            }));
        }
    }

    return (
        <MyContainer>
            <section id="cabecalhoListaAtividade">
                <Grid container={true}>
                    <Grid item={true} xs={12} sm={6} lg={6}>
                        <GeneralTitle>Lista de Atividades</GeneralTitle>
                    </Grid>
                    <Grid item={true} xs={12} sm={6} lg={6} className={classes.activityMode}>
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                            <Button onClick={() => initialRevisionLoad()}>ADs</Button>
                            <Button onClick={() => setRevision(false)}>Atividades</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </section>

            <section id="dadosListaAtividades">
                <Grid container={true} spacing={2} justify="center">
                    <Grid  item={true} xs={12} sm={12} lg={12}>
                        <ActivityTable data={revision ? revisoes : atividades} revision={revision} setMount={setMount}/>
                            <div className="create-button">
                                <CreateButton title="Inserir Atividade" url="/controle-atividade/create"/>
                            </div>
                    </Grid>
                </Grid>
            </section>

        </MyContainer>
    );
};
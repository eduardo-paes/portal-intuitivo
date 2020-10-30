import React, { useState, useEffect } from "react";
import api from '../../api'

// -- Estilos
import { MyContainer, CreateButton, GeneralTitle } from "../../assets/styles/styledComponents"
import { makeStyles } from '@material-ui/core/styles';
import { ActivityTable, ActivityDialog } from "../../components";
import { Grid, Button, ButtonGroup, Tooltip } from '@material-ui/core';

// -- Local Styles
const useStyles = makeStyles((theme) => ({
    activityMode: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
        },
        [theme.breakpoints.up('sm')]: {
            justifyContent: 'flex-end',
        }
    }
}));

export default function ActivityList() {
    const classes = useStyles();
    const [atividades, setAtividades] = useState([]);
    const [revisoes, setRevisoes] = useState([]);

    const [isRevision, setIsRevision] = useState(false);
    const [filterDialog, setFilterDialog] = useState(false);

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

    const [atividadeSelecionda, setAtividadeSelecionda] = useState('');
    const [hiddenDialog, setHiddenDialog] = useState(false);

    async function fetchAtividadesAPI() {
        const response = await api.listarAtividades();
        if (response.data.success) {
            setAtividades(response.data.data);
        }
    }

    async function fetchRevisoesAPI() {
        const response = await api.listarRevisao();
        if (response.data.success) {
            setRevisoes(response.data.data);
        }
    }

    // -- Lista as atividades do banco
    useEffect(() => {
        const abortController = new AbortController();
        fetchAtividadesAPI()
        return abortController.abort();
    }, []);

    // -- Atualização a partir de montagem
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
        setIsRevision(true);
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
            <section id="cabecalhoAtividade">
                <Grid container={true}>
                    <Grid item={true} xs={12} sm={6} lg={6}>
                        <GeneralTitle>Atividades</GeneralTitle>
                    </Grid>
                    <Grid item={true} xs={12} sm={6} lg={6} className={classes.activityMode}>
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                            <Tooltip title="Atividades Gerais">
                                <Button onClick={() => setIsRevision(false)}>Atividades</Button>
                            </Tooltip>

                            <Tooltip title="Avaliações Diagnósticas">
                                <Button onClick={() => initialRevisionLoad()}>ADs</Button>
                            </Tooltip>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </section>

            <section id="tabelaAtividades">
                <ActivityTable 
                    data={isRevision ? revisoes : atividades} 
                    revision={isRevision} 
                    filterDialog={filterDialog}
                    setFilterDialog={setFilterDialog}
                    setActivity={setAtividadeSelecionda} 
                    setHidden={setHiddenDialog} 
                    setMount={setMount}
                />

                <ActivityDialog 
                    atividadeID={atividadeSelecionda}
                    open={hiddenDialog}
                    setOpen={setHiddenDialog}
                />
            </section>

            <section id="rodapeAtividades">
                <div className="create-button">
                    <CreateButton title="Inserir Atividade" url="/controle-atividade/create"/>
                </div>
            </section>
        </MyContainer>
    );
};
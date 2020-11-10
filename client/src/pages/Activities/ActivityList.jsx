import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../utils";
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
    const { token } = useContext(StoreContext);
    const disciplinas = token.disciplina;

    const [atividades, setAtividades] = useState([]);
    const [auxAtividade, setAuxAtividade] = useState('');
    const [revisoes, setRevisoes] = useState([]);
    const [isRevision, setIsRevision] = useState(false);

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

    const [filterDialog, setFilterDialog] = useState(false);
    const [filter, setFilter] = useState({
        tipo: "",
        disciplinaID: "",
        topico: "",
        numeracao: "",
        area: ""
    });

    async function fetchAtividadesAPI() {
        if (disciplinas.length) {
            var arrayAux = [];
    
            disciplinas.forEach(async item => {
                const response = await api.listarAtividadePorDisciplina(item.disciplinaID);
                const value = response.data;
    
                if (value.success) {
                    if (arrayAux.length) {
                        arrayAux = arrayAux.concat(value.data);
                    } else {
                        arrayAux = value.data;
                    }
                    setAtividades(arrayAux);
                }
            });
        } else {
            var firstSubject = await api.listarDisciplinas();
            firstSubject = firstSubject.data.data[0];
            setAuxAtividade(firstSubject._id);
            const response = await api.listarAtividadePorDisciplina(firstSubject._id);
            if (response.data.success) {
                setAtividades(response.data.data);
            }
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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
    }, [mount]);

    // -- Carrega tabela conforme disciplina selecionada no filtro
    useEffect(() => {
        const abortController = new AbortController();

        async function fetchActivitiesByFilter(disciplinaID) {
            const response = await api.listarAtividadePorDisciplina(disciplinaID);
            const value = response.data;
            setAtividades(value.data);
        }

        if (!isRevision) {
            if (filter.disciplinaID !== '') {
                fetchActivitiesByFilter(filter.disciplinaID);
            } 
            else if (auxAtividade !== '') {
                fetchActivitiesByFilter(auxAtividade);
            }
        }
        return abortController.abort();
    // eslint-disable-next-line
    }, [filter])

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
                    filter={filter}
                    setFilter={setFilter}
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
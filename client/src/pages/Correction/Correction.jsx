import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../utils";
import api from '../../api'

import { GeneralSubtitle, GeneralTitle, MyContainer } from "../../assets/styles/styledComponents"
import { makeStyles, ButtonGroup, Tooltip, Button, Grid, Typography } from "@material-ui/core";
import { CorrectionTable, CorrectionDialog } from '../../components'

// -- Local Styles
const useStyles = makeStyles((theme) => ({
    groupButtons: {
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

export default function Correction() {
    const classes = useStyles();
    const { token } = useContext(StoreContext);
    const disciplinas = token.disciplina;
    const [atividade, setAtividade] = useState([]);
    const [redacao, setRedacao] = useState([]);
    const [isEssay, setIsEssay] = useState(false);
    const [wasLoaded, setWasLoaded] = useState({
        atividade: false,
        redacao: false,
    })
    const [toLoad, setToLoad] = useState({
        atividade: true,
        redacao: false,
    })
    const [selectedRow, setSelectedRow] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [filterDialog, setFilterDialog] = useState(false);
    const [filter, setFilter] = useState({
        numeracao: '',
        disciplina: '',
        topico: '',
        tipo: '',
        aluno:'',
    });

    // -- Carrega Atividades
    function fetchAtividades() {
        var arrayAux = [];

        disciplinas.forEach(async item => {
            const response = await api.listarRespostaAlunoPorDisciplina(item.disciplinaID);
            const value = response.data;

            if (value.success) {
                if (arrayAux.length) {
                    arrayAux = arrayAux.concat(value.data);
                } else {
                    arrayAux = value.data;
                }
                setAtividade(arrayAux);
            }
        });

        setWasLoaded(preValue => ({
            ...preValue,
            atividade: true
        }));
        setToLoad(preValue => ({
            ...preValue,
            atividade: false
        }));
    }

    // -- Carrega Redacoes
    async function fetchRedacoes() {
        var arrayAux = [];

        disciplinas.forEach(async item => {
            const response = await api.listarRedacoesNaoCorrigidas(item.disciplinaID);
            var value = response.data;

            if (value.success) {
                if (arrayAux.length) {
                    arrayAux = arrayAux.concat(value.data);
                } else {
                    arrayAux = value.data;
                }
                setRedacao(arrayAux);
            }
        });

        setWasLoaded(preValue => ({
            ...preValue,
            redacao: true
        }));
        setToLoad(preValue => ({
            ...preValue,
            redacao: false
        }));
    }

    // -- Carregamento inicial dos dados para preenchimento das tabelas
    useEffect(() => {
        const abortController = new AbortController();

        // Carrega atividades não corrigidas
        if (toLoad.atividade) {
            setIsEssay(false);
            (!wasLoaded.atividade && !atividade.length) 
                ?   fetchAtividades()
                :   setToLoad(preValue => ({ ...preValue, atividade: false }));
        }

        // Carrega reações não corrigidas
        if (toLoad.redacao) {
            setIsEssay(true);
            (!wasLoaded.redacao && !redacao.length) 
                ?   fetchRedacoes()
                    :   setToLoad(preValue => ({ ...preValue, redacao: false }));
        }

        return abortController.abort();
        // eslint-disable-next-line
    }, [toLoad])

    // -- Carregamento inicial das redações
    useEffect(() => {
        const abortController = new AbortController();
        (!wasLoaded.redacao && !toLoad.redacao && redacao.length) && fetchRedacoes();
        return abortController.abort();
        // eslint-disable-next-line
    }, [wasLoaded.redacao])

    // -- Carrega tabela conforme disciplina selecionada no filtro
    useEffect(() => {
        const abortController = new AbortController();

        async function fetchActivitiesByFilter(disciplinaID) {
            const response = await api.listarRespostaAlunoPorDisciplina(disciplinaID);
            const value = response.data;
            setAtividade(value.data);
        }

        async function fetchEssaysByFilter(disciplinaID) {
            const response = await api.listarRedacoesNaoCorrigidas(disciplinaID);
            const value = response.data;
            setRedacao(value.data);
        }

        if (isEssay) {
            if (filter.disciplina !== '') {
                isEssay ? fetchEssaysByFilter(filter.disciplina) : fetchActivitiesByFilter(filter.disciplina);
            } 
            else {
                isEssay ? fetchRedacoes() : fetchAtividades();
            }
        }
        return abortController.abort();
    // eslint-disable-next-line
    }, [filter])

    // -- Carrega tabela com dados ou mensagem caso não haja dados
    const ReturnCorrectionTable = () => {
        var data = [];
        var title = "";

        if (isEssay) {
            data = redacao;
            title = "redações";
        } else {
            data = atividade;
            title = "atividades";
        }

        if (data.length > 0) {
            return (
                <CorrectionTable 
                    data={data} 
                    essay={isEssay} 
                    filterDialog={filterDialog}
                    setFilterDialog={setFilterDialog}
                    setSelectedRow={setSelectedRow}
                    setDialogOpen={setDialogOpen}
                    filter={filter}
                    setFilter={setFilter}
                />
            )
        } else {
            return <GeneralSubtitle>Pode relaxar que não há {title} pendentes para correção aqui!</GeneralSubtitle>
        }
    }

    // -- Retorna mensagem informando quantidade de correções pendentes
    const returnCountingPendencies = () => {
        if (isEssay) {
            if (redacao.length > 0) {
                return (<Typography variant="h6">Correções pendentes: {redacao.length}</Typography>)
            }
            return;
        }

        if (atividade.length > 0) {
            return (<Typography variant="h6">Correções pendentes: {atividade.length}</Typography>)
        }
        return;
    }

    return (
        <MyContainer>
            <section id="correctionHeader">
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} sm={12}>
                        <GeneralTitle id="correctionTitle">Correções Pendentes</GeneralTitle>
                        { returnCountingPendencies() }
                    </Grid>

                    <Grid align="right" item={true} xs={12} sm={12} className={classes.groupButtons}>
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                            <Tooltip title="Visualizar Redações">
                                <Button onClick={() => setToLoad(preValue => ({ ...preValue, redacao: true}))}>Redações</Button>
                            </Tooltip>

                            <Tooltip title="Visualizar Atividades">
                                <Button onClick={() => setToLoad(preValue => ({ ...preValue, atividade: true}))}>Atividades</Button>
                            </Tooltip>

                            {/* <Tooltip title="Visualizar Avaliações Diagnósticas">
                                <Button onClick={() => setToLoad(preValue => ({ ...preValue, atividade: true}))}>ADs</Button>
                            </Tooltip> */}
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </section>

            <section id="tabelaCorrecoes">
                {ReturnCorrectionTable()}
            </section>

            <section id="correctionDialogs">
                {
                    selectedRow && 
                        <CorrectionDialog 
                            redacaoID={selectedRow.redacaoID._id}
                            data={selectedRow} 
                            aluno={selectedRow.alunoID} 
                            open={dialogOpen} 
                            setOpen={setDialogOpen}
                            setWasChanged={setWasLoaded}
                        /> 
                }
            </section>
        </MyContainer>
    )
}
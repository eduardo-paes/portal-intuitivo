import React, { useEffect, useState, useContext } from "react";

import { StoreContext } from "../../utils";
import api from '../../api'

import { GeneralTitle, MyContainer } from "../../assets/styles/styledComponents"
import { makeStyles, ButtonGroup, Tooltip, Button, Grid } from "@material-ui/core";
import { CorrectionTable } from '../../components'

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

export default function Correction(props) {
    const classes = useStyles();
    const { token } = useContext(StoreContext);
    const disciplinas = token.disciplina;
    const professorID = token.userID;

    const [atividade, setAtividade] = useState([]);
    const [redacao, setRedacao] = useState([]);
    
    const [filterDialog, setFilterDialog] = useState(false);
    const [isEssay, setIsEssay] = useState(false);
    const [wasLoaded, setWasLoaded] = useState({
        atividade: false,
        redacao: false,
        aluno: false
    })
    const [toLoad, setToLoad] = useState({
        atividade: true,
        redacao: false,
        aluno: false
    })

    async function fetchOneSubjectList(disciplinaID) {
        const response = await api.listarRespostaAlunoPorDisciplina(disciplinaID);
        console.log(response);
        return response.data;
    }

    function fetchAtividades() {
        var arrayAux = [];

        disciplinas.forEach(item => {
            const value = fetchOneSubjectList(item.disciplinaID);
            console.log(value);
            // value.success && arrayAux.concat(value.data);
        })
        
        setAtividade(arrayAux);
        setWasLoaded(preValue => ({
            ...preValue,
            atividade: true
        }));
        setToLoad(preValue => ({
            ...preValue,
            atividade: false
        }));
    }

    async function fetchRedacoes() {
        const response = await api.listarRedacoesNaoCorrigidas(disciplinas);
        const value = response.data;
        if (value.success) {
            setRedacao(value.data);
            setWasLoaded(preValue => ({
                ...preValue,
                redacao: true
            }));
        }
        setToLoad(preValue => ({
            ...preValue,
            redacao: false
        }));
    }

    useEffect(() => {
        const abortController = new AbortController();

        console.log(disciplinas);

        if (toLoad.atividade) {
            setIsEssay(false);
            (!wasLoaded.atividade && !atividade.length) 
                ?   fetchAtividades()
                :   setToLoad(preValue => ({ ...preValue, atividade: false }));
        }

        // if (toLoad.redacao) {
        //     setIsEssay(true);
        //     (!wasLoaded.redacao && !redacao.length) 
        //         ?   fetchRedacoes()
        //         :   setToLoad(preValue => ({ ...preValue, redacao: false }));
        // }

        // (toLoad.aluno && !wasLoaded.aluno) && fetchAlunos();

        return abortController.abort();
        // eslint-disable-next-line
    }, [toLoad])

    return (
        <MyContainer>
            <section id="correctionHeader">
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} sm={12}>
                        <GeneralTitle id="correctionTitle">Correções Pendentes</GeneralTitle>
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
                {/* <CorrectionTable 
                    data={isEssay ? redacao : atividade} 
                    essay={isEssay} 
                    filterDialog={filterDialog}
                    setFilterDialog={setFilterDialog}
                /> */}
            </section>

        </MyContainer>
    )
}
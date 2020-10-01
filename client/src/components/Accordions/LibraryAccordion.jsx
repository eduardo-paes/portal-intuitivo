import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from "../../utils";
import api from '../../api';

// -- Material UI Components
import { AccordionDetails, AccordionSummary, Button, Checkbox, Grid, Slide, Typography, withStyles } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import CircularStatic from '../ProgressBar/CircularStatic';

// -- Components
import { GreenButton } from '../../assets/styles/styledComponents';
import { useStyles } from './styles';
import { ExerciseDialog, StudyContentDialog } from '../'

// -- Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import AulaIcon from '@material-ui/icons/OndemandVideo';
import FixacaoIcon from '@material-ui/icons/LocalLibrary';
import RetomadaIcon from '@material-ui/icons/AssignmentReturn';
import AprofundamentoIcon from '@material-ui/icons/FindInPage';

const AccordionPersonalized = withStyles({
    root: {
      borderBottom: `0.20rem solid #fdc504`,
      width: '100%'
    }
})(MuiAccordion);

export default function ContentAccordion(props) {
    const { topicoID, disciplinaNome, titulo, semana, linkAula } = props;
    const { token } = useContext(StoreContext)
    const classes = useStyles();
    
    // Definição dos estados que serão utilizados
    const [ progresso, setProgresso ] = useState(0);
    const [ activity, setActivity ] = useState({
        retomada: [],
        fixacao: [],
        aprofundamento: []
    })
    const [ open, setOpen ] = useState({
        materialEstudo: false,
        videoaula: false,
        exercicioFixacao: false,
        exercicioRetomada: false,
        exercicioAprofundamento: false
    });
    const [ check, setCheck ] = useState({
        materialEstudo: false,
        videoaula: false,
    });
    const [ gridSize, setGridSize ] = useState({
        exe: 3,
        cont: 3
    });
    const [ topicProgress, setTopicProgress ] = useState({
        topicoID: topicoID,
        alunoID: token.userID,
        progresso: {}
    });

    // Definição das funções 
    const handleClickOpen = (event) => {
        const name  = event.target.offsetParent.id;
        setOpen(preValue => ({
            ...preValue,
            [name]: true
        }));
    };

    const handleClickVideo = (event) => {
        setCheck(preValue => ({
            ...preValue,
            videoaula: true
        }));
        setProgresso(progresso+1);
        window.open(linkAula,'_blank');
    }

    const initialLoading = () => {
        async function fetchAtividadeAPI() {
            const response = await api.listarAtividadesPorTopico(topicoID);
            if (response.data.success) {
                const value = response.data.data;
                value.forEach(item => {
                    if (item.tipoAtividade === 'Retomada') {
                        return setActivity(preValue => ({
                            ...preValue,
                            retomada: item
                        }))
                    } else if (item.tipoAtividade === 'Fixação') {
                        return setActivity(preValue => ({
                            ...preValue,
                            fixacao: item
                        }))
                    } else if (item.tipoAtividade === 'Aprofundamento') {
                        return setActivity(preValue => ({
                            ...preValue,
                            aprofundamento: item
                        }))
                    }
                })
            }
        }
        fetchAtividadeAPI();
    }

    async function saveProgress() {
        const novoProgresso = {
            alunoID: topicProgress.alunoID,
            topicoID: topicProgress.topicoID,
            progresso: check,
        }

        if (topicProgress._id === undefined) {
            await api
                .inserirProgresso(novoProgresso)
                .then(res => {
                    setTopicProgress(preValue => ({
                        ...preValue,
                        _id: res.data.id
                    }))
                    console.log(res.data.message);
                })
                
        } else {
            await api
                .atualizarProgresso(topicProgress._id, novoProgresso)
                .then(res => {
                    console.log(res.data.message);
                })
        }
    }

    useEffect(() => {
        const abortController = new AbortController();
        setTopicProgress(preValue => ({
            ...preValue,
            progresso: check
        }));
        // console.log(topicProgress)
        // saveProgress();
        return abortController.abort();
        // eslint-disable-next-line
    }, [check])

    // -- Fetch do Progresso
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchProgressAPI() {
            const response = await api.encProgressoPorTopico(topicoID);
            const value = response.data;
            if (value.success) {
                setTopicProgress(value.data);
                console.log(value.data);
            }
        }
        fetchProgressAPI();
        return abortController.abort();
        // eslint-disable-next-line
    }, [])

    // -- Fetch das Atividades
    useEffect(() => {
        let fixTam = activity.fixacao.length;
        let retTam = activity.retomada.length;
        let aprTam = activity.aprofundamento.length;
        let count = 0;

        if (fixTam && check.exercicioFixacao === undefined) {
            setCheck(preValue => ({
                ...preValue,
                exercicioFixacao: topicProgress.progresso.fixacao,
            }))
            count++;
        }

        if (retTam && check.exercicioRetomada === undefined) {
            setCheck(preValue => ({
                ...preValue,
                exercicioRetomada: topicProgress.progresso.retomada,
            }))
            count++;
        }

        if (aprTam && check.exercicioAprofundamento === undefined) {
            setCheck(preValue => ({
                ...preValue,
                exercicioAprofundamento: topicProgress.progresso.aprofundamento
            }))
            count++;
        }

        if (count) {
            count === 1 && setGridSize({
                exe: 4,
                cont: 4
            });

            count === 2 && setGridSize({
                exe: 3,
                cont: 3
            });

            count === 3 && setGridSize({
                exe: 3,
                cont: 2
            });
        }
    // eslint-disable-next-line
    }, [activity])

    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <AccordionPersonalized>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    onClick={() => initialLoading()}
                    aria-controls="panel1a-content"
                    id="cabecalhoAccordionLibrary">
                    <CircularStatic progresso={progresso}/>
                    <Typography id="heading" className={classes.heading}>{titulo}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Grid container={true} className={classes.accordionDetails} spacing={3}>

                        {/* Subtitulo do Accordion */}
                        <Grid item={true} xs={12} sm={12}>
                            <Grid container={true} style={{padding: "0 1rem 0"}}>
                                <Grid item={true} xs={6} sm={6}>
                                    <Typography className={classes.secondaryHeading}>{disciplinaNome}</Typography>
                                </Grid>
                                <Grid item={true} xs={6} sm={6}>
                                    <Typography className={classes.subtitleLibrary}>Semana {semana}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* ---=== Conteúdo ===--- */}
                        {/* Material de Estudo */}
                        <Grid item={true} xs={12} sm={gridSize.cont}>
                            <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                            {
                                check.materialEstudo 
                                    ? <GreenButton 
                                        className={classes.activityButton} 
                                        id="materialEstudo"
                                        variant="contained"
                                        color="primary"
                                        fullWidth={true}
                                        startIcon={<SchoolIcon />}
                                        onClick={handleClickOpen}>Conteúdo</GreenButton>
                                    : <Button 
                                        className={classes.activityButton} 
                                        id="materialEstudo" 
                                        variant="outlined" 
                                        color="primary" 
                                        fullWidth={true}
                                        startIcon={<SchoolIcon />}
                                        onClick={handleClickOpen}>Conteúdo</Button>
                            }
                            <StudyContentDialog 
                                topicoID={topicoID}
                                titulo={titulo}
                                progresso={progresso}
                                setProgresso={setProgresso}
                                open={open}
                                setOpen={setOpen}
                                setCheck={setCheck}
                            />
                        </Grid>
                        
                        {/* Video-aula */}
                        <Grid item={true} xs={12} sm={gridSize.cont}>
                            <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.videoaula}/>
                            {
                                check.videoaula 
                                ? <GreenButton 
                                    className={classes.activityButton} 
                                    id="videoaula" 
                                    color="primary" 
                                    variant="contained" 
                                    fullWidth={true} 
                                    startIcon={<AulaIcon />}
                                    onClick={handleClickVideo}>Videoaula</GreenButton>
                                : <Button 
                                    className={classes.activityButton} 
                                    id="videoaula" 
                                    color="primary" 
                                    variant="outlined" 
                                    fullWidth={true} 
                                    startIcon={<AulaIcon />}
                                    onClick={handleClickVideo} 
                                > Videoaula </Button>
                            }
                        </Grid>

                        {/* Exercícios de Fixação */}
                        { activity.fixacao.length !== 0 &&
                            <Grid item={true} xs={12} sm={gridSize.exe}>
                                <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.exercicioFixacao}/>
                                {
                                    check.exercicioFixacao 
                                        ? <GreenButton 
                                            className={classes.activityButton} 
                                            id="exercicioFixacao" 
                                            fullWidth={true} 
                                            variant="contained" 
                                            color="primary" 
                                            startIcon={<FixacaoIcon />}
                                            onClick={handleClickOpen}>Fixação</GreenButton>
                                        : <Button 
                                            className={classes.activityButton} 
                                            id="exercicioFixacao" 
                                            fullWidth={true} 
                                            variant="outlined" 
                                            color="primary" 
                                            startIcon={<FixacaoIcon />}
                                            onClick={handleClickOpen}>Fixação</Button>
                                }

                                <ExerciseDialog 
                                    topicoID={topicoID}
                                    open={open.exercicioFixacao}
                                    setOpen={setOpen}
                                    setCheck={setCheck}
                                    title="Exercício de Fixação"
                                    name="exercicioFixacao"
                                    activityType="Fixação"
                                    progresso={progresso}
                                    setProgresso={setProgresso}
                                />
                            </Grid>
                        }

                        {/* Exercícios de Retomada */}
                        { activity.retomada.length !== 0 &&
                            <Grid item={true} xs={12} sm={gridSize.exe}>
                                <Checkbox className={classes.checkbox} disabled={true} hidden={true} checked={check.exercicioRetomada}/>
                                {
                                    check.exercicioRetomada 
                                        ? <GreenButton 
                                            className={classes.activityButton} 
                                            id="exercicioRetomada" 
                                            fullWidth={true} 
                                            variant="contained" 
                                            color="primary" 
                                            startIcon={<RetomadaIcon />}
                                            onClick={handleClickOpen}>Retomada</GreenButton>
                                        : <Button 
                                            className={classes.activityButton} 
                                            id="exercicioRetomada" 
                                            fullWidth={true} 
                                            variant="outlined" 
                                            color="primary" 
                                            startIcon={<RetomadaIcon />}
                                            onClick={handleClickOpen}>Retomada</Button>
                                }

                                <ExerciseDialog 
                                    topicoID={topicoID}
                                    open={open.exercicioRetomada}
                                    setOpen={setOpen}
                                    setCheck={setCheck}
                                    title="Retomada"
                                    name="exercicioRetomada"
                                    activityType="Retomada"
                                    progresso={progresso}
                                    setProgresso={setProgresso}
                                />
                            </Grid>
                        }

                        {/* Exercícios de Aprofundamento */}
                        { activity.aprofundamento.length !== 0 &&
                            <Grid item={true} xs={12} sm={gridSize.exe}>
                                <Checkbox className={classes.checkbox} disabled={true} hidden={true} checked={check.exercicioAprofundamento}/>
                                {
                                    check.exercicioAprofundamento 
                                        ? <GreenButton 
                                            className={classes.activityButton} 
                                            id="exercicioAprofundamento" 
                                            variant="contained" 
                                            color="primary" 
                                            fullWidth={true} 
                                            startIcon={<AprofundamentoIcon />}
                                            onClick={handleClickOpen}>Aprofundamento</GreenButton>
                                        : <Button 
                                            className={classes.activityButton} 
                                            id="exercicioAprofundamento" 
                                            variant="outlined" 
                                            color="primary" 
                                            fullWidth={true} 
                                            startIcon={<AprofundamentoIcon />}
                                            onClick={handleClickOpen}>Aprofundamento</Button>
                                }

                                <ExerciseDialog 
                                    topicoID={topicoID}
                                    open={open.exercicioAprofundamento}
                                    setOpen={setOpen}
                                    setCheck={setCheck}
                                    title="Aprofundamento"
                                    name="exercicioAprofundamento"
                                    activityType="Aprofundamento"
                                    progresso={progresso}
                                    setProgresso={setProgresso}
                                />
                            </Grid>
                        }
                    </Grid>
                </AccordionDetails>
            </AccordionPersonalized>
        </Slide>
    )
}
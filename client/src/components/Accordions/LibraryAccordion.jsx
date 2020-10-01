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
    const [progresso, setProgresso] = useState(0);
    const [activity, setActivity] = useState({
        retomada: [],
        fixacao: [],
        aprofundamento: []
    })
    const [open, setOpen] = useState({
        materialEstudo: false,
        videoaula: false,
        exercicioFixacao: false,
        exercicioRetomada: false,
        exercicioAprofundamento: false
    });
    const [check, setCheck] = useState({
        materialEstudo: false,
        videoaula: false,
    });
    const [gridSize, setGridSize] = useState({
        exe: 0,
        cont: 6
    });
    const [topicProgress, setTopicProgress] = useState({
        topicoID: topicoID,
        alunoID: token.userID,
        progresso: {}
    });
    const [numTasks, setNumTasks] = useState(2);                              // Número de tarefas do tópico
    const [wasChecked, setWasChecked] = useState(false)

    // Definição das funções 
    const handleClickOpen = (event) => {
        const name = event.target.offsetParent.id;
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
        setProgresso(progresso + 1);
        setWasChecked(true);
        window.open(linkAula,'_blank');
    }

    const initialLoading = () => {
        async function fetchAtividadeAPI() {
            const response = await api.listarAtividadesPorTopico(topicoID);
            if (response.data.success) {
                let value = response.data.data;
                let count = 0;
                
                // Salva as respectivas atividades em seus campos
                value.forEach(item => {
                    if (item.tipoAtividade === 'Retomada') {
                        count++;
                        return setActivity(preValue => ({
                            ...preValue,
                            retomada: item
                        }))
                    } else if (item.tipoAtividade === 'Fixação') {
                        count++;
                        return setActivity(preValue => ({
                            ...preValue,
                            fixacao: item
                        }))
                    } else if (item.tipoAtividade === 'Aprofundamento') {
                        count++;
                        return setActivity(preValue => ({
                            ...preValue,
                            aprofundamento: item
                        }))
                    }
                })
                
                // Número de botões no acordeão
                count === 0 && setNumTasks(2);
                count === 1 && setNumTasks(3);
                count === 2 && setNumTasks(4);
                count === 3 && setNumTasks(5);

                // Grid com divisão dinâmica
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
                        exe: 2,
                        cont: 3
                    });
                }
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

        if (!topicProgress._id) {
            await api
                .inserirProgresso(novoProgresso)
                .then(res => {
                    setTopicProgress(preValue => ({
                        ...preValue,
                        _id: res.data.id
                    }))
                })
        } else {
            await api
                .atualizarProgresso(topicProgress._id, novoProgresso)
                .then(res => {
                    console.log(res.data.message);
                })
        }
    }

    // -- Salva o progresso após cada alteração em Check
    useEffect(() => {
        const abortController = new AbortController();
        setTopicProgress(preValue => ({
            ...preValue,
            progresso: check
        }));
        if (wasChecked) {
            saveProgress();
            setWasChecked(false);
        }
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
                if (value.data.progresso) {
                    let auxProgress = value.data.progresso;
                    let count = 0;
                    setCheck(auxProgress);

                    auxProgress.videoaula && count++;
                    auxProgress.materialEstudo && count++;
                    auxProgress.exercicioAprofundamento && count++;
                    auxProgress.exercicioFixacao && count++;
                    auxProgress.exercicioRetomada && count++;

                    setProgresso(count);
                }
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

        if (fixTam && check.exercicioFixacao === undefined) {
            setCheck(preValue => ({
                ...preValue,
                exercicioFixacao: topicProgress.progresso.fixacao,
            }))
        }

        if (retTam && check.exercicioRetomada === undefined) {
            setCheck(preValue => ({
                ...preValue,
                exercicioRetomada: topicProgress.progresso.retomada,
            }))
        }

        if (aprTam && check.exercicioAprofundamento === undefined) {
            setCheck(preValue => ({
                ...preValue,
                exercicioAprofundamento: topicProgress.progresso.aprofundamento
            }))
        }
    // eslint-disable-next-line
    }, [activity])

    const returnTopico = () => {
        return (
            <>
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
                        setWasChecked={setWasChecked}
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
                            activity={activity.fixacao}
                            open={open.exercicioFixacao}
                            setOpen={setOpen}
                            setCheck={setCheck}
                            title="Exercício de Fixação"
                            name="exercicioFixacao"
                            progresso={progresso}
                            setProgresso={setProgresso}
                            setWasChecked={setWasChecked}
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
                                    value="exercicioRetomada"
                                    startIcon={<RetomadaIcon />}
                                    onClick={handleClickOpen}>Retomada</Button>
                        }

                        <ExerciseDialog 
                            activity={activity.retomada}
                            open={open.exercicioRetomada}
                            setOpen={setOpen}
                            setCheck={setCheck}
                            title="Retomada"
                            name="exercicioRetomada"
                            progresso={progresso}
                            setProgresso={setProgresso}
                            setWasChecked={setWasChecked}
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
                            activity={activity.aprofundamento}
                            open={open.exercicioAprofundamento}
                            setOpen={setOpen}
                            setCheck={setCheck}
                            title="Aprofundamento"
                            name="exercicioAprofundamento"
                            progresso={progresso}
                            setProgresso={setProgresso}
                            setWasChecked={setWasChecked}
                        />
                    </Grid>
                }
            </>
        )
    }

    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <AccordionPersonalized>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    onClick={() => initialLoading()}
                    aria-controls="panel1a-content"
                    id="cabecalhoAccordionLibrary">
                    <CircularStatic progresso={progresso} numTasks={numTasks}/>
                    <Typography id="heading" className={classes.heading}>{titulo}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Grid container={true} className={classes.accordionDetails} spacing={2}>
                        { returnTopico() }
                    </Grid>
                </AccordionDetails>
            </AccordionPersonalized>
        </Slide>
    )
}
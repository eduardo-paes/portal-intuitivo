import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from "../../utils";
import api from '../../api';

// -- Material UI Components
import { AccordionDetails, AccordionSummary, Button, Checkbox, Grid, Grow, Typography, withStyles } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import CircularStatic from '../ProgressBar/CircularStatic';

// -- Components
import { GreenButton } from '../../assets/styles/styledComponents';
import { useStyles } from './styles';
import { ExerciseDialog, StudyContentDialog } from '..'

// -- Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import AulaIcon from '@material-ui/icons/OndemandVideo';
import FixacaoIcon from '@material-ui/icons/LocalLibrary';
import RetomadaIcon from '@material-ui/icons/AssignmentReturn';
import AprofundamentoIcon from '@material-ui/icons/FindInPage';

function subtituloAcordeao(tipoAcordeao, titulo, disciplinaNome, semana, classes) {
    if (tipoAcordeao === 'biblioteca') {
        return (
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
        )
    } else {
        return (
            <Grid item={true} xs={12} sm={12}>
                <Typography id="secondaryHeading" className={classes.secondaryHeading}>{titulo}</Typography>
            </Grid>
        )
    }
}

export default function ContentAccordion(props) {
    const { revisaoID, topicoID, disciplinaNome, titulo, semana, linkAula, tipoAcordeao } = props;
    const { token } = useContext(StoreContext)
    const alunoID = token.userID;
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
        exercicioAprofundamento: false,
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
        alunoID: alunoID,
        progresso: {}
    });
    const [numTasks, setNumTasks] = useState(2);                              // Número de tarefas do tópico
    const [wasChecked, setWasChecked] = useState(false)
    const [questoesAD, setQuestoesAD] = useState([]); 

    // Ajuste de cores do acordeão
    let { color } = props;
    if (!color) {color = '#fdc504'};

    // Acordeão personalizado
    const AccordionPersonalized = withStyles({
        root: {
          borderBottom: `0.2rem solid ${color}`,
          width: '100%'
        }
    })(MuiAccordion);

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

    // -- Carregamento inicial
    useEffect(() => {
        if (topicoID) {
            async function fetchAtividadeAPI() {
                const response = await api.listarAtividadesPorTopico(topicoID);
                if (response.data.success) {
                    let value = response.data.data;
                    let count = 0;

                    // Caso a atividade seja uma redação
                    if (disciplinaNome === 'Redação') {
                        setCheck({ redacao: false });
                        setOpen({ redacao: false });
                        return setActivity(value);
                    }
                    
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
        // eslint-disable-next-line
    }, [])

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
        if (topicoID && alunoID) {
            async function fetchProgressAPI() {
                const response = await api.encProgressoPorTopico(alunoID, topicoID);
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
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [])

    // -- Atualiza os checks de cada atividade após cada alteração em atividade
    useEffect(() => {
        if (disciplinaNome !== 'Redação') {
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
        }
    // eslint-disable-next-line
    }, [activity])

    // -- Acordeão de Redação
    const returnRedacao = () => {

        const handleCheckEssay = () => {
            setOpen({ redacao: true });
        }

        const handleUpload = () => {
            setCheck({ redacao: true });
            setProgresso(progresso + 1);
        }

        return (
            <>
                <Grid align="center" item={true} xs={12} lg={6} sm={6}>
                    <Typography id="secondaryHeading" className={classes.secondaryHeading}>
                        Nos botões a seguir você pode visualizar o enunciado e entregar sua redação para correção dos nossos professores.
                    </Typography>
                </Grid>

                {/* Visualizar Enunciado */}
                <Grid align="center" item={true} align='right' xs={12} lg={3} sm={3}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.redacao 
                            ? <GreenButton fullWidth={true} id="redacao" variant="contained" color="primary" onClick={handleCheckEssay}>Enunciado</GreenButton>
                            : <Button fullWidth={true} id="redacao" variant="outlined" color="primary" onClick={handleCheckEssay}>Enunciado</Button>
                    }

                        <ExerciseDialog 
                            activity={activity}
                            open={open.redacao}
                            setOpen={setOpen}
                            setCheck={setCheck}
                            title="Retomada"
                            name="exercicioRetomada"
                            progresso={progresso}
                            setProgresso={setProgresso}
                            setWasChecked={setWasChecked}
                        />
                </Grid>

                {/* Subir Redação */}
                <Grid align="center" item={true} align='right' xs={12} lg={3} sm={3}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.redacao 
                            ? <GreenButton fullWidth={true} id="redacao" variant="contained" color="primary" onClick={handleUpload}>Subir Redação</GreenButton>
                            : <Button fullWidth={true} id="redacao" variant="outlined" color="primary" onClick={handleUpload}>Subir Redação</Button>
                    }
                </Grid>
            </>
        )
    }

    // -- Acordeão de ADs
    const returnAD = () => {
        return (
            <>
                <Grid align="center" item={true} xs={12} lg={6} sm={6}>
                    <Typography id="secondaryHeading" className={classes.secondaryHeading}>Are you ready?! Clique ao lado para fazer sua avaliação diagnóstica.</Typography>
                </Grid>
                <Grid align="center" item={true} xs={12} lg={6} sm={6}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.avaliacaoDiagnostica 
                            ? <GreenButton className={classes.activityButton} id="avaliacaoDiagnostica" variant="contained" color="primary" onClick={handleClickOpen}>Avaliação Diagnóstica</GreenButton>
                            : <Button className={classes.activityButton} id="avaliacaoDiagnostica" variant="outlined" color="primary" onClick={handleClickOpen}>Avaliação Diagnóstica</Button>
                    }
                    {
                        (questoesAD.length > 0) 
                            ? <ExerciseDialog 
                                topicoID={topicoID}
                                open={open.avaliacaoDiagnostica}
                                setOpen={setOpen}
                                setCheck={setCheck}
                                title="Avaliação Diagnóstica"
                                name="exercicioFixacao"
                                activityType="Avaliação Diagnóstica"
                                progresso={progresso}
                                setProgresso={setProgresso}
                                question={questoesAD}/>
                            : null
                    }
                </Grid>
            </>
        )
    }

    // -- Acordeão Padrão dos Tópicos
    const returnTopico = () => {
        return (
            <>
                {/* Subtitulo do Acordeão */}
                {subtituloAcordeao(tipoAcordeao, titulo, disciplinaNome, semana, classes)}

                {/* Material de Estudo */}
                <Grid item={true} xs={12} sm={gridSize.cont ? gridSize.cont : 'auto'}>
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
                <Grid item={true} xs={12} sm={gridSize.cont ? gridSize.cont : 'auto'}>
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
                    <Grid item={true} xs={12} sm={gridSize.exe ? gridSize.exe : 'auto'}>
                        <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.exercicioFixacao ? check.exercicioFixacao : false}/>
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
                    <Grid item={true} xs={12} sm={gridSize.exe ? gridSize.exe : 'auto'}>
                        <Checkbox className={classes.checkbox} disabled={true} hidden={true} checked={check.exercicioRetomada ? check.exercicioRetomada : false}/>
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
                    <Grid item={true} xs={12} sm={gridSize.exe ? gridSize.exe : 'auto'}>
                        <Checkbox className={classes.checkbox} disabled={true} hidden={true} checked={check.exercicioAprofundamento ? check.exercicioAprofundamento : false}/>
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
        <Grow in={true} style={{ transformOrigin: '0 0 0' }} {...({ timeout: 1000 })}>
            <AccordionPersonalized>
                <AccordionSummary
                    className={classes.accordionSummary}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="cabecalhoAccordionLibrary">
                    <CircularStatic progresso={progresso} numTasks={numTasks}/>
                    <Typography id="heading" className={classes.heading}>{titulo}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Grid container={true} className={classes.accordionDetails} spacing={2}>
                        {
                            (revisaoID !== undefined )
                                ? returnAD() 
                                : (disciplinaNome === 'Redação') 
                                    ? returnRedacao() 
                                    : returnTopico()
                        }
                    </Grid>
                </AccordionDetails>
            </AccordionPersonalized>
        </Grow>
    )
}
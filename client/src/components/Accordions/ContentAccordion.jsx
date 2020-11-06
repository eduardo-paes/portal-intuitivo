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
import { ExerciseDialog, StudyContentDialog, UploadEssay } from '..'

// -- Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import AulaIcon from '@material-ui/icons/OndemandVideo';
import FixacaoIcon from '@material-ui/icons/LocalLibrary';
import RetomadaIcon from '@material-ui/icons/AssignmentReturn';
import AprofundamentoIcon from '@material-ui/icons/FindInPage';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SimpleFeedback from '../Dialogs/StudentDialogs/SimpleFeedback';

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
    const { topicoID, disciplinaNome, titulo, semana, linkAula, tipoAcordeao, essay, revision } = props;
    const { token } = useContext(StoreContext)
    const alunoID = token.userID;
    const classes = useStyles();

    // Definição dos estados que serão utilizados
    const [progresso, setProgresso] = useState(0);                              // Contagem do Progresso
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
    const [numTasks, setNumTasks] = useState((essay || revision) ? 0 : 2);      // Número de tarefas do tópico
    const [wasChecked, setWasChecked] = useState(false);                        // Flag de salvamento do Progresso                      

    const [wasLoaded, setWasLoaded] = useState(false);                          // Flag de carregamento da animação do Acordeão
    const [feedOpen, setFeedOpen] = useState(false);                            // Abre dialogo de inserção da redação
    const [feedMsg, setFeedMsg] = useState({
        title: '',
        message: ''
    });

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

    // Função de abertura dos diálogos
    const handleClickOpen = async (event) => {
        const name = await event.target.offsetParent.id;
        setOpen(preValue => ({
            ...preValue,
            [name]: true
        }));
    };

    // ==============================================
    // Funções da API
    // ==============================================

    // Salvamento do progresso do TÓPICO
    async function saveTopicProgress() {
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

    // Salvamento do progresso da REDAÇÃO
    async function saveEssayProgress() {
        const novoProgresso = {
            alunoID: topicProgress.alunoID,
            redacaoID: essay._id,
            progresso: check.redacao,
            corrigido: false
        }

        if (!topicProgress._id) {
            await api
                .inserirProgressoRedacao(novoProgresso)
                .then(res => {
                    setTopicProgress(preValue => ({
                        ...preValue,
                        _id: res.data.id
                    }))
                    console.log(res.data.message);
                })
        } else {
            await api
                .atualizarProgressoRedacao(topicProgress._id, novoProgresso)
                .then(res => {
                    console.log(res.data.message);
                })
        }
    }

    // Salvamento do progresso da REVISÃO
    async function saveRevisionProgress() {
        const novoProgresso = {
            alunoID: topicProgress.alunoID,
            revisaoID: revision._id,
            progresso: check.avaliacaoDiagnostica,
        }

        if (!topicProgress._id) {
            await api
                .inserirProgressoRevisao(novoProgresso)
                .then(res => {
                    setTopicProgress(preValue => ({
                        ...preValue,
                        _id: res.data.id
                    }))
                    console.log(res.data.message);
                })
        } else {
            await api
                .atualizarProgressoRevisao(topicProgress._id, novoProgresso)
                .then(res => {
                    console.log(res.data.message);
                })
        }
    }

    // Carrega progresso do TÓPICO
    async function fetchProgressoTopicoAPI() {
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

    // Carrega progresso da REDAÇÃO
    async function fetchProgressoRedacaoAPI() {
        const response = await api.encProgressoPorRedacaoID(alunoID, essay._id);
        const value = response.data;
        if (value.success) {
            setTopicProgress(value.data);
            setCheck({ 
                redacao: value.data.progresso,
                materialEstudo: value.data.progresso,
            });
            setProgresso(value.data.progresso ? 1 : 0);
        }
    }

    // Carrega progresso da REVISAO
    async function fetchProgressoRevisaoAPI() {
        const response = await api.encProgressoPorRevisaoID(alunoID, revision._id);
        const value = response.data;
        if (value.success) {
            setTopicProgress(value.data);
            setCheck({ avaliacaoDiagnostica: value.data.progresso });
            setProgresso(value.data.progresso ? 1 : 0);
        }
    }

    // Carrega as atividades do banco
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
                count === 1 && setGridSize({ exe: 4, cont: 4 });
                count === 2 && setGridSize({ exe: 3, cont: 3 });
                count === 3 && setGridSize({ exe: 2, cont: 3 });
            }
        }
    }

    // -- Carregamento inicial dos dados
    useEffect(() => {
        const abortController = new AbortController();

        if (topicoID) {
            fetchAtividadeAPI();
            fetchProgressoTopicoAPI();
        }

        if (essay) {
            setCheck({ redacao: false });
            setOpen({ 
                redacao: false, 
                materialEstudo: false
            });
            fetchProgressoRedacaoAPI();
        }

        if (revision) {
            setCheck({ avaliacaoDiagnostica: false });
            setOpen({ avaliacaoDiagnostica: false });
            fetchProgressoRevisaoAPI();
        }

        return abortController.abort();
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
            topicoID && saveTopicProgress();
            revision && saveRevisionProgress();
            essay && saveEssayProgress();
            setWasChecked(false);
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [wasChecked])

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
        const uploadLink = `http://localhost:5000/api/upload-redacao/${alunoID}/${essay._id}`;
        return (
            <>
                <Grid item={true} align='center' xs={12} sm={3}>
                    <Typography id="secondaryHeading" className={classes.secondaryHeading}>
                        Não se esqueça de ler com atenção o tema e a proposta da redacão.
                    </Typography>
                </Grid>

                {/* Material de Estudo */}
                <Grid item={true} align='right' xs={12} sm={3}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.redacao 
                            ? <GreenButton 
                                className={classes.activityButton} 
                                id="materialEstudo"
                                variant="contained"
                                color="primary"
                                fullWidth={true}
                                startIcon={<SchoolIcon />}
                                onClick={handleClickOpen}>Tema</GreenButton>
                            : <Button 
                                className={classes.activityButton} 
                                id="materialEstudo" 
                                variant="outlined" 
                                color="primary" 
                                fullWidth={true}
                                startIcon={<SchoolIcon />}
                                onClick={handleClickOpen}>Tema</Button>
                    }
                    <StudyContentDialog 
                        topicoID={essay.topicoID._id}
                        titulo={titulo}
                        progresso={progresso}
                        setProgresso={setProgresso}
                        open={open}
                        setOpen={setOpen}
                        check={check}
                        setCheck={setCheck}
                        setWasChecked={setWasChecked}
                    />
                </Grid>

                {/* Visualizar Enunciado */}
                <Grid item={true} align='right' xs={12} sm={3}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.redacao 
                            ? <GreenButton 
                                fullWidth={true} 
                                id="redacao" 
                                variant="contained" 
                                color="primary" 
                                startIcon={<VisibilityIcon />}
                                onClick={handleClickOpen}>Proposta</GreenButton>
                                : <Button 
                                fullWidth={true} 
                                id="redacao" 
                                variant="outlined" 
                                color="primary" 
                                startIcon={<VisibilityIcon />}
                                onClick={handleClickOpen}>Proposta</Button>
                    }
                    
                        <ExerciseDialog 
                            activity={essay}
                            open={open.redacao ? open.redacao : false}
                            setOpen={setOpen}
                            setCheck={setCheck}
                            title="Redação"
                            name="redacao"
                            progresso={progresso}
                            setProgresso={setProgresso}
                            setWasChecked={setWasChecked}
                        />
                </Grid>

                {/* Subir Redação */}
                <Grid item={true} align='right' xs={12} sm={3}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    <UploadEssay 
                        uploadLink={uploadLink} 
                        checked={check.redacao}
                        correction={false}
                        setFeedMsg={setFeedMsg}
                        setFeedOpen={setFeedOpen}
                        setCheck={setCheck}
                        progresso={progresso}
                        setProgresso={setProgresso}
                        setWasChecked={setWasChecked}
                        primaryTitle="Subir Redação" 
                        secondaryTitle='Reenviar Redação' />
                    <SimpleFeedback
                        open={feedOpen}
                        setOpen={setFeedOpen}
                        title={feedMsg.title}
                        message={feedMsg.message}/>
                </Grid>
            </>
        )
    }

    // -- Acordeão de ADs
    const returnAD = () => {
        return (
            <>
                <Grid align="center" item={true} xs={12} sm={8}>
                    <Typography id="secondaryHeading" className={classes.secondaryHeading}>
                        Are you ready?! <br/> Já está liberada sua avaliação diagnóstica, clique no botão que se segue para começar!
                    </Typography>
                </Grid>
                <Grid align="center" item={true} xs={12} sm={4}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.avaliacaoDiagnostica 
                            ? <GreenButton className={classes.activityButton} fullWidth={true} id="avaliacaoDiagnostica" variant="contained" color="primary" onClick={handleClickOpen}>Avaliação Concluída</GreenButton>
                            : <Button className={classes.activityButton} fullWidth={true} id="avaliacaoDiagnostica" variant="outlined" color="primary" onClick={handleClickOpen}>Iniciar Avaliação</Button>
                    }
                    <ExerciseDialog 
                        activity={revision}
                        open={open.avaliacaoDiagnostica ? open.avaliacaoDiagnostica : false}
                        setOpen={setOpen}
                        setCheck={setCheck}
                        title="Avaliação Diagnóstica"
                        name="avaliacaoDiagnostica"
                        progresso={progresso}
                        setProgresso={setProgresso}
                        setWasChecked={setWasChecked}
                        answered={topicProgress}
                    />
                </Grid>
            </>
        )
    }

    // -- Acordeão Padrão dos Tópicos
    const returnTopico = () => {
        // Ao clicar no botão de videoaula
        const handleClickVideo = () => {
            if (!check.videoaula) {
                setCheck(preValue => ({
                    ...preValue,
                    videoaula: true
                }));
                setProgresso(progresso + 1);
                setWasChecked(true);
            }
            window.open(linkAula,'_blank');
        }

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
                        check={check}
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
                            answered={topicProgress}
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
                            answered={topicProgress}
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
                            answered={topicProgress}
                        />
                    </Grid>
                }
            </>
        )
    }

    return (
        <Slide in={wasLoaded} direction="up">
            <AccordionPersonalized TransitionProps={{ unmountOnExit: false }}>
                <AccordionSummary
                    className={classes.accordionSummary}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="cabecalhoAccordionLibrary">
                    <CircularStatic progresso={progresso} numTasks={numTasks} wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} />
                    <Typography id="heading" className={classes.heading}>{titulo}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Grid container={true} className={classes.accordionDetails} spacing={2}>
                        {
                            (revision)
                                ? returnAD() 
                                : (essay) 
                                    ? returnRedacao() 
                                    : returnTopico()
                        }
                    </Grid>
                </AccordionDetails>
            </AccordionPersonalized>
        </Slide>
    )
}

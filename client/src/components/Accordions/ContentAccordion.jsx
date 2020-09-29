import React, { useEffect, useState } from 'react';
import { AccordionDetails, AccordionSummary, AppBar, Button, Checkbox, Dialog, Grid, IconButton, Slide, Toolbar, Typography, withStyles } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import PDFViewer from '../PDFViewer/PDFViewer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import CloseIcon from '@material-ui/icons/Close';
import CircularStatic from '../ProgressBar/CircularStatic';
import { GreenButton } from '../../assets/styles/styledComponents';
import { useStyles } from '../../assets/styles/classes';
import api from '../../api';
import ActivityCard from '../Cards/ActivityCard'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
}); 

export default function ContentAccordion(props) {
    
    const { questoesAvDiag, revisaoID, topicoID, area, nome, color, week, disciplina } = props;

    // Definição dos estados que serão utilizados
    const [ progresso, setProgresso ] = useState(0);
    const [ open, setOpen ] = useState({
        materialEstudo: false,
        exercicioFixacao: false,
        videoaula: false,
        exercicioAprofundamento: false,
        avaliacaoDiagnostica: false
    });
    const [ check, setCheck ] = useState({
        materialEstudo: false,
        exercicioFixacao: false,
        videoaula: false,
        exercicioAprofundamento: false,
        redacao: false,
        avaliacaoDiagnostica: false
    });

    const [ activity, setActivity ] = useState([]);
    const [ questoesFixacao, setQuestoesFixacao ] = useState([]); 
    const [ questoesAprofundamento, setQuestoesAprofundamento ] = useState([]); 
    const [ questoesAD, setQuestoesAD ] = useState([]); 

    const [ fixacaoCarregada, setFixacaoCarregada ] = useState(false); 
    const [ aprofundamentoCarregada, setAprofundamentoCarregada ] = useState(false);
    const [ ADCarregada, setADCarregada ] = useState(false);
    
    const AccordionPersonalized = withStyles({
        root: {
          borderBottom: `0.20rem solid ${color}`,
          width: '100%'
        }
    })(MuiAccordion);
    const classes = useStyles();
    
    // -- Carrega as atividades do tópico correspondente
    useEffect(() => {
        const abortController = new AbortController();
        if (topicoID && disciplina !== "Redação" && revisaoID === undefined) {
            async function fetchAtividadeAPI() {
                console.log(revisaoID)
                const response = await api.listarAtividadesPorTopico(topicoID);
                setActivity(response.data.data);
            }
            fetchAtividadeAPI();
        }
        
        return abortController.abort();
    }, [topicoID] )
    
    // -- Carrega questão dado o id
    useEffect(() => {
        const abortController = new AbortController();
        
        let questoes = [];
        let ids = ["5f6ce34bd9aa9c282987d4f2", "5f6ce3dbd9aa9c282987d4f8", "5f6cad86684a00105e4a5939"]
        
        if( open.exercicioFixacao && !fixacaoCarregada) {

            const atividadeFixacao = activity.find((element) => element.tipoAtividade === "Fixação");
            
            async function fetchQuestoesAPI() {
                for(let i = 0; i < atividadeFixacao.questoes.length; ++i) {
                    const response = await api.encQuestaoPorID(ids[i]);
                    const value = response.data.data;
                    questoes.push(value);
                }
                setQuestoesFixacao(questoes);
            }
            
            fetchQuestoesAPI();
            setFixacaoCarregada(true);
        
        } else if ( open.exercicioAprofundamento && !aprofundamentoCarregada ) {
            
            const atividadeAprofundamento = activity.find((element) => element.tipoAtividade === "Aprofundamento");
            
            async function fetchQuestoesAPI() {
                for(let i = 0; i < atividadeAprofundamento.questoes.length; ++i) {
                    const response = await api.encQuestaoPorID(ids[i]);
                    const value = response.data.data;
                    questoes.push(value);
                }
                setQuestoesAprofundamento(questoes);
            }
            
            fetchQuestoesAPI();
            setAprofundamentoCarregada(true);

        } else if ( open.avaliacaoDiagnostica && !ADCarregada ) {

            console.log(questoesAvDiag);
            
            async function fetchQuestoesAPI() {
                for(let i = 0; i < questoesAvDiag.length; ++i) {
                    const response = await api.encQuestaoPorID(questoesAvDiag[i].questaoID);
                    const value = response.data.data;
                    questoes.push(value);
                }
                setQuestoesAD(questoes);
            }
            
            fetchQuestoesAPI();

            setADCarregada(true);

        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [open]);

    // Definição das funções 
    const handleClickOpen = (event) => {
        const name  = event.target.offsetParent.id;
        setOpen(preValue => ({
            ...preValue,
            [name]: true
        }));
    };

    const handleClose = (event) => {
        setOpen({
            materialEstudo: false,
            exercicioFixacao: false,
            videoaula: false,
            exercicioAprofundamento: false
        });
    };

    const handleFinalized = (event) => {
        const name  = event.target.offsetParent.id;
        setCheck(preValue => ({
            ...preValue,
            [name]: true
        }));
        setProgresso(progresso+1);
    };

    const handleClickVideo = (event) => {
        const name  = event.target.offsetParent.id;
        setCheck(preValue => ({
            ...preValue,
            [name]: true
        }));
        setProgresso(progresso+1);
        window.open("https://www.youtube.com/watch?v=j5YJYJ_qXho&list=PL3qONjKuaO2R7hih4hEPXp4_xgoB6nUQk",'_blank');
    }

    function returnTopico() {
        return (
            <Grid className={classes.accordionDetails} container={true} spacing={3}>
                <Grid align="center" item={true} xs={12} lg={12} sm={12}>
                    <Typography id="secondaryHeading" className={classes.secondaryHeading}>{nome}</Typography>
                </Grid>
                {/* Material de Estudo */}
                <Grid align="center" item={true} xs={12} lg={3} sm={12}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.materialEstudo ?
                        <GreenButton className={classes.activityButton} id="materialEstudo" variant="contained" color="primary" onClick={handleClickOpen}>Material de Estudo</GreenButton>
                        : 
                        <Button className={classes.activityButton} id="materialEstudo" variant="outlined" color="primary" onClick={handleClickOpen}>Material de Estudo</Button>
                    }
                    <Dialog fullScreen open={open.materialEstudo} onClose={handleClose} TransitionComponent={Transition}>
                        <AppBar className={classes.appBar}>
                            <Toolbar>
                                <IconButton id="materialEstudo" edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant="h6" className={classes.title}>
                                    {nome}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Grid container={true} spacing={3}>
                            <Grid className={classes.material} item={true} xs={12} lg={12} sm={12} align='center'>
                                <PDFViewer source={ `http://localhost:5000/uploads/content/${topicoID}.pdf`}/>
                            </Grid>
                            <Grid item={true} xs={12} lg={12} sm={12} align='center' >
                                <Button id="materialEstudo" autoFocus variant='contained' color="primary" onClick={handleFinalized}>
                                    Finalizado
                                </Button>
                            </Grid>
                        </Grid>    
                    </Dialog>
                </Grid>
                {/* Exercícios de Fixação */}
                <Grid align="center" item={true} xs={12} lg={3} sm={12}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.exercicioFixacao}/>
                    {
                        check.exercicioFixacao ?
                        <GreenButton className={classes.activityButton} id="exercicioFixacao" variant="contained" color="primary" onClick={handleClickOpen}>Exercícios de Fixação</GreenButton>
                        : 
                        <Button className={classes.activityButton} id="exercicioFixacao" variant="outlined" color="primary" onClick={handleClickOpen}>Exercícios de Fixação</Button>
                    }
                    {
                        (questoesFixacao.length > 0) ?  
                        <ActivityCard 
                            open={open.exercicioFixacao} 
                            titulo="Exercícios de Fixação" 
                            atividadeID={activity[0]._id} 
                            handleClose={handleClose} 
                            handleFinalized={handleFinalized} 
                            question={questoesFixacao}
                        />
                        : null
                    }
                    
                </Grid>
                {/* Video-aula */}
                <Grid align="center" item={true} xs={12} lg={3} sm={12}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.videoaula}/>
                    {
                        check.videoaula ?
                        <GreenButton className={classes.activityButton} id="videoaula" variant="contained" color="primary" onClick={handleClickOpen}>Vídeoaula</GreenButton>
                        : 
                        <Button 
                            className={classes.activityButton} 
                            id="videoaula" 
                            color="primary" 
                            variant="outlined" 
                            startIcon={<SchoolIcon />}
                            onClick={handleClickVideo} 
                        >
                            Participar
                        </Button>
                    }
                </Grid>
                {/* Exercícios de Aprofundamento */}
                <Grid align="center" item={true} xs={12} lg={3} sm={12}>
                    <Checkbox className={classes.checkbox} disabled={true} checked={check.exercicioAprofundamento}/>
                    {
                        check.exercicioAprofundamento ?
                        <GreenButton className={classes.activityButton} id="exercicioAprofundamento" variant="contained" color="primary" onClick={handleClickOpen}>Aprofundamento</GreenButton>
                        : 
                        <Button className={classes.activityButton} id="exercicioAprofundamento" variant="outlined" color="primary" onClick={handleClickOpen}>Aprofundamento</Button>
                    }
                    {
                        (questoesAprofundamento.length > 0) ?  
                        <ActivityCard 
                            open={open.exercicioAprofundamento} 
                            titulo="Exercícios de Aprofundamento" 
                            atividadeID={activity[0]._id} 
                            handleClose={handleClose} 
                            handleFinalized={handleFinalized} 
                            question={questoesAprofundamento}
                        />
                        : null
                    }
                </Grid>
            </Grid>
        )
    }

    function returnRedacao() {

        function handleUpload() {
            setCheck((prevValue) => ({
                ...prevValue,
                redacao: true
            }));
            setProgresso(4);
        }

        return (
            <>
                <Grid align="center" item={true} xs={12} lg={6} sm={6}>
                    <Typography id="secondaryHeading" className={classes.secondaryHeading}>Para entregar sua redação, clique no botão ao lado.</Typography>
                </Grid>
                <Grid align="center" item={true} xs={12} lg={6} sm={6}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.redacao ?
                        <GreenButton className={classes.activityButton} id="redacao" variant="contained" color="primary" onClick={handleUpload}>Subir Redação</GreenButton>
                        : 
                        <Button className={classes.activityButton} id="redacao" variant="outlined" color="primary" onClick={handleUpload}>Subir Redação</Button>
                    }
                </Grid>
            </>
        )
    }

    function returnAD() {

        return (
            <>
                <Grid align="center" item={true} xs={12} lg={6} sm={6}>
                    <Typography id="secondaryHeading" className={classes.secondaryHeading}>Are you ready?! Clique ao lado para fazer sua avaliação diagnóstica.</Typography>
                </Grid>
                <Grid align="center" item={true} xs={12} lg={6} sm={6}>
                    <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                    {
                        check.avaliacaoDiagnostica ?
                        <GreenButton className={classes.activityButton} id="avaliacaoDiagnostica" variant="contained" color="primary" onClick={handleClickOpen}>Avaliação Diagnóstica</GreenButton>
                        : 
                        <Button className={classes.activityButton} id="avaliacaoDiagnostica" variant="outlined" color="primary" onClick={handleClickOpen}>Avaliação Diagnóstica</Button>
                    }
                    {
                        (questoesAD.length > 0) ?  
                        <ActivityCard 
                            open={open.avaliacaoDiagnostica} 
                            titulo="Avaliação Diagnóstica"  
                            revisaoID={'revisaoID'}
                            handleClose={handleClose} 
                            handleFinalized={handleFinalized} 
                            question={questoesAD}
                        />
                        : null
                    }
                </Grid>
            </>
        )
    }

    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <AccordionPersonalized>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <CircularStatic progresso={progresso}/>
                    <Typography id="heading" className={classes.heading}>{disciplina}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    { 
                        disciplina === "Redação" ?
                            returnRedacao()
                        : disciplina === "Avaliação Diagnóstica" ?
                            returnAD()
                        :   returnTopico()
                    }
                </AccordionDetails>
            </AccordionPersonalized>
        </Slide>
    )
}
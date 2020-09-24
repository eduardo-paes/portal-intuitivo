import React, { useEffect } from 'react';
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
    
    const { topicoID, area, nome, color, week } = props;

    const AccordionPersonalized = withStyles({
        root: {
          borderBottom: `0.20rem solid ${color}`,
          width: '100%'
        }
    })(MuiAccordion);
    const classes = useStyles();
    
    // Definição dos estados que serão utilizados
    const [ progresso, setProgresso ] = React.useState(0);
    const [ open, setOpen ] = React.useState({
        materialEstudo: false,
        exercicioFixacao: false,
        videoaula: false,
        exercicioAprofundamento: false
    });
    const [ check, setCheck ] = React.useState({
        materialEstudo: false,
        exercicioFixacao: false,
        videoaula: false,
        exercicioAprofundamento: false
    });
    const [ activity, setActivity ] = React.useState([]);
    const [ question, setQuestion ] = React.useState([]); 

    // -- Carrega as atividades do tópico correspondente
    useEffect(() => {
        const abortController = new AbortController();

        if (topicoID !== '') {
            async function fetchAtividadeAPI() {
                const response = await api.listarAtividadesPorTopico(topicoID);
                console.log(response);
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
        console.log(activity)
        let ids = ["5f6ce34bd9aa9c282987d4f2", "5f6ce3dbd9aa9c282987d4f8", "5f6cad86684a00105e4a5939"]
        if( open.exercicioFixacao || open.exercicioAprofundamento ) {
            async function fetchQuestaoAPI() {
                for(let i = 0; i < 3; ++i) {
                    const response = await api.encQuestaoPorID(ids[i]);
                    const value = response.data.data;
                    questoes.push(value);
                }
                setQuestion(questoes);
            }
            fetchQuestaoAPI();
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
        setOpen(preValue => ({
            ...preValue,
            [name]: false
        }));
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

    return (

    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <AccordionPersonalized>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <CircularStatic progresso={progresso}/>
                <Typography id="heading" className={classes.heading}>{nome}</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                        <Dialog fullScreen open={open.exercicioFixacao} onClose={handleClose}>
                            <AppBar className={classes.appBar}>
                                <Toolbar>
                                    <IconButton id="exercicioFixacao" edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h6" className={classes.title}>
                                        Exercícios de Fixação
                                    </Typography>
                                </Toolbar>
                            </AppBar>
                            <Grid container={true} spacing={1}>
                                {
                                    (question.length > 0) ? 
                                        <ActivityCard atividadeID={activity[0]._id} handleClose={handleClose} handleFinalized={handleFinalized} question={question}/>
                                    : null
                                }
                            </Grid>
                        </Dialog>
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
                            //<Button className={classes.activityButton} id="videoaula" variant="outlined" color="primary" onClick={handleClickOpen}>Vídeoaula</Button>
                        }
                        {/* <Dialog fullScreen open={open.videoaula} onClose={handleClose} TransitionComponent={Transition}>
                            <AppBar className={classes.appBar}>
                                <Toolbar>
                                    <IconButton id="videoaula" edge="start" color="inherit" onClick={handleCloseIconButton} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h6" className={classes.title}>
                                        Vídeoaula
                                    </Typography>
                                </Toolbar>
                            </AppBar>
                            <Grid container={true} spacing={3}>
                                <Grid item={true} xs={12} lg={12} sm={12} align='center'>
                                </Grid>
                                <Grid item={true} xs={12} lg={12} sm={12} align='center' >
                                    <Button id="videoaula" autoFocus variant='contained' color="primary" onClick={handleFinalized}>
                                        Assistido
                                    </Button>
                                </Grid>
                            </Grid>
                        </Dialog> */}
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
                        <Dialog fullScreen open={open.exercicioAprofundamento} onClose={handleClose} TransitionComponent={Transition}>
                        <AppBar className={classes.appBar}>
                            <Toolbar>
                            <IconButton id="exercicioAprofundamento" edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Exercícios de Aprofundamento
                            </Typography>
                            </Toolbar>
                        </AppBar>
                        <Grid container={true} spacing={3}>
                            <Grid item={true} xs={12} lg={12} sm={12} align='center'>
                            <Typography>Aqui ficarão os exercícios de aprofundamento.</Typography>
                            </Grid>
                            <Grid item={true} xs={12} lg={12} sm={12} align='center' >
                            <Button id="exercicioAprofundamento" autoFocus variant='contained' color="primary" onClick={handleFinalized}>
                                Finalizado
                            </Button>
                            </Grid>
                        </Grid>
                        </Dialog>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </AccordionPersonalized>
    </Slide>
    )
}
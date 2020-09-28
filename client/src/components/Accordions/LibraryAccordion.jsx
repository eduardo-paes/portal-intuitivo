import React, { useState } from 'react';

// -- Material UI Components
import { AccordionDetails, AccordionSummary, AppBar, Button, Checkbox, Dialog, Grid, IconButton, Slide, Toolbar, Typography, withStyles } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import CircularStatic from '../ProgressBar/CircularStatic';

// -- Components
import { GreenButton } from '../../assets/styles/styledComponents';
import { useStyles } from '../../assets/styles/classes';
import { ExerciseDialog, PDFViewer } from '../'

// -- Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
}); 

const AccordionPersonalized = withStyles({
    root: {
      borderBottom: `0.20rem solid #fdc504`,
      width: '100%'
    }
})(MuiAccordion);

export default function ContentAccordion(props) {
    const { topicoID, disciplinaNome, titulo, semana } = props;

    // Definição dos estados que serão utilizados
    const [ progresso, setProgresso ] = useState(0);
    const [ open, setOpen ] = useState({
        materialEstudo: false,
        exercicioFixacao: false,
        videoaula: false,
        exercicioAprofundamento: false
    });
    const [ check, setCheck ] = useState({
        materialEstudo: false,
        exercicioFixacao: false,
        videoaula: false,
        exercicioAprofundamento: false
    });

    const classes = useStyles();

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
        const name = event.target.offsetParent.id;
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
                    id="cabecalhoAccordionLibrary">
                    <CircularStatic progresso={progresso}/>
                    <Typography id="heading" className={classes.heading}>{titulo}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Grid className={classes.accordionDetails} container={true} spacing={3}>

                        {/* Subtitulo do Accordion */}
                        <Grid align="center" item={true} xs={12} lg={12} sm={12}>
                            <Grid container={true} style={{padding: "0 1rem 0"}} spacing={2}>
                                <Grid item={true} xs={6} sm={6}>
                                    <Typography className={classes.secondaryHeading}>{disciplinaNome}</Typography>
                                </Grid>
                                <Grid item={true} xs={6} sm={6}>
                                    <Typography className={classes.subtitleLibrary}>Semana {semana}</Typography>
                                </Grid>
                            </Grid>
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
                                            {titulo}
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

                            <ExerciseDialog 
                                topicoID={topicoID}
                                open={open.exercicioFixacao}
                                setOpen={setOpen}
                                title="Exercício de Fixação"
                                name="exercicioFixacao"
                                activityType="Fixação"
                                progresso={progresso}
                                setProgresso={setProgresso}
                            />

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

                            <ExerciseDialog 
                                topicoID={topicoID}
                                open={open.exercicioAprofundamento}
                                setOpen={setOpen}
                                title="Aprofundamento"
                                name="exercicioAprofundamento"
                                activityType="Aprofundamento"
                                progresso={progresso}
                                setProgresso={setProgresso}
                            />
                        </Grid>
                    
                    </Grid>
                </AccordionDetails>
            </AccordionPersonalized>
        </Slide>
    )
}
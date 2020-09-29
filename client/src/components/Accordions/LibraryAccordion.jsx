import React, { useState } from 'react';
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
import { useEffect } from 'react';

const AccordionPersonalized = withStyles({
    root: {
      borderBottom: `0.20rem solid #fdc504`,
      width: '100%'
    }
})(MuiAccordion);

export default function ContentAccordion(props) {
    const { topicoID, disciplinaNome, titulo, semana, linkAula } = props;
    
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

    const handleClickVideo = (event) => {
        const name  = event.target.offsetParent.id;
        setCheck(preValue => ({
            ...preValue,
            [name]: true
        }));
        setProgresso(progresso+1);

        window.open(linkAula,'_blank');
    }

    useEffect(() => {
        async function fetchAtividadeAPI() {
            const response = await api.listarAtividadesPorTopico(topicoID);
            if (response.data.success) {
                const value = response.data.data;
                console.log(value);
            }
        }

        fetchAtividadeAPI();
        // eslint-disable-next-line
    }, [])

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

                        {/* ---=== Conteúdo ===--- */}
                        {/* Material de Estudo */}
                        <Grid align="center" item={true} xs={12} lg={3} sm={12}>
                            <Checkbox className={classes.checkbox} hidden={true} disabled={true} checked={check.materialEstudo}/>
                            {
                                check.materialEstudo 
                                    ? <GreenButton className={classes.activityButton} id="materialEstudo" variant="contained" color="primary" onClick={handleClickOpen}>Material de Estudo</GreenButton>
                                    : <Button className={classes.activityButton} id="materialEstudo" variant="outlined" color="primary" onClick={handleClickOpen}>Material de Estudo</Button>
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
                                check.videoaula 
                                ? <GreenButton className={classes.activityButton} id="videoaula" variant="contained" color="primary" onClick={handleClickOpen}>Vídeoaula</GreenButton>
                                : <Button 
                                    className={classes.activityButton} 
                                    id="videoaula" 
                                    color="primary" 
                                    variant="outlined" 
                                    startIcon={<SchoolIcon />}
                                    onClick={handleClickVideo} 
                                > Participar </Button>
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
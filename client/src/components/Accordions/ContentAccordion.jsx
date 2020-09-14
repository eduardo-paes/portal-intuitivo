import React from 'react';
import { AccordionDetails, AccordionSummary, AppBar, Button, Checkbox, Dialog, Grid, IconButton, Slide, Toolbar, Typography, withStyles } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import PDFViewer from '../PDFViewer/PDFViewer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import CircularStatic from '../ProgressBar/CircularStatic';
import { GreenButton } from '../../assets/styles/styledComponents';
import { useStyles } from './classes';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
}); 

export default function ContentAccordion(props) {
    
    const { id, topico, disciplina, color } = props;


    const AccordionPersonalized = withStyles({
        root: {
          borderBottom: `0.20rem solid ${color}`,
          width: '100%'
        }
    })(MuiAccordion);
    const classes = useStyles();
    
    // Definição dos estados que serão utilizados
    const [ progresso, setProgresso ] = React.useState(0);
    const [open, setOpen] = React.useState({
        materialEstudo: false,
        exercicioFixacao: false,
        videoaula: false,
        exercicioAprofundamento: false
    });
    const [check, setCheck] = React.useState({
        materialEstudo: false,
        exercicioFixacao: false,
        videoaula: false,
        exercicioAprofundamento: false
    });

    // Definição das funções 
    const handleClickOpen = (event) => {
        const name  = event.target.offsetParent.id;
        setOpen(preValue => ({
            ...preValue,
            [name]: true
        }));
    };

    const handleClose = (event) => {
        const name  = event.target.offsetParent.id;
        setOpen(preValue => ({
            ...preValue,
            [name]: false
        }));
    };

    const handleCloseIconButton = (event) => {
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

    return (
        <AccordionPersonalized>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <CircularStatic progresso={progresso}/>
                <Typography id="heading" className={classes.heading}>{topico}</Typography>
                <Typography id="secondaryHeading" className={classes.secondaryHeading}>{disciplina.nome}</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Grid className={classes.accordionDetails} container={true} spacing={3}>
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
                            <IconButton id="materialEstudo" edge="start" color="inherit" onClick={handleCloseIconButton} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {topico}
                            </Typography>
                            </Toolbar>
                        </AppBar>
                        <Grid container={true} spacing={3}>
                            <Grid className={classes.material} item={true} xs={12} lg={12} sm={12} align='center'>
                            <PDFViewer source={`http://localhost:5000/uploads/content/${id}.pdf`}/>
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
                        <Dialog fullScreen open={open.exercicioFixacao} onClose={handleClose} TransitionComponent={Transition}>
                        <AppBar className={classes.appBar}>
                            <Toolbar>
                            <IconButton id="exercicioFixacao" edge="start" color="inherit" onClick={handleCloseIconButton} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Exercícios de Fixação
                            </Typography>
                            </Toolbar>
                        </AppBar>
                        <Grid container={true} spacing={3}>
                            <Grid item={true} xs={12} lg={12} sm={12} align='center'>
                            <Typography>Aqui ficarão os exercícios.</Typography>
                            </Grid>
                            <Grid item={true} xs={12} lg={12} sm={12} align='center' >
                            <Button id="exercicioFixacao" autoFocus variant='contained' color="primary" onClick={handleFinalized}>
                                Finalizado
                            </Button>
                            </Grid>
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
                            <Button className={classes.activityButton} id="videoaula" variant="outlined" color="primary" onClick={handleClickOpen}>Vídeoaula</Button>
                        }
                        <Dialog fullScreen open={open.videoaula} onClose={handleClose} TransitionComponent={Transition}>
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
                            <Typography>Aqui ficará a vídeoaula.</Typography>
                            </Grid>
                            <Grid item={true} xs={12} lg={12} sm={12} align='center' >
                            <Button id="videoaula" autoFocus variant='contained' color="primary" onClick={handleFinalized}>
                                Assistido
                            </Button>
                            </Grid>
                        </Grid>
                        </Dialog>
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
                        <IconButton id="exercicioAprofundamento" edge="start" color="inherit" onClick={handleCloseIconButton} aria-label="close">
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
    )
}
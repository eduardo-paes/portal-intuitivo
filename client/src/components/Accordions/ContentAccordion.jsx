import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Button, Checkbox, Dialog, Grid, IconButton, makeStyles, Slide, Toolbar, Typography } from '@material-ui/core';
import PDFViewer from '../PDFViewer/PDFViewer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import CircularStatic from '../ProgressBar/CircularStatic';
import { GreenButton } from '../../assets/styles/styledComponents';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
      marginLeft: '1rem',
      alignItems: 'center',
      display: 'flex'
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      alignItems: 'center',
      justifyContent: 'right',
      textAlign: 'right',
      display: 'grid'
    },
    appBar: {
      position: 'relative',
    },
    activityButton: {
        width: '17rem'
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    finalizedButton: {
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center'
    },
    material: {
      marginTop: '2rem',
      marginRight: '5rem',
      marginLeft: '5rem'
    },
    checkbox: {
        display: 'none'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
}); 

export default function ContentAccordion(props) {

    const classes = useStyles();
    const { id, topico, disciplina } = props;
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
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
                <CircularStatic progresso={progresso}/>
                <Typography className={classes.heading}>{topico}</Typography>
                <Typography className={classes.secondaryHeading}>{disciplina.nome}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Grid container={true} spacing={6}>
                <Grid item={true} xs={12} lg={3} sm={12}>
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
                <Grid item={true} xs={12} lg={3} sm={12}>
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
                <Grid item={true} xs={12} lg={3} sm={12}>
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
                <Grid item={true} xs={12} lg={3} sm={12}>
                    <Checkbox className={classes.checkbox} disabled={true} checked={check.exercicioAprofundamento}/>
                    {
                        check.exercicioAprofundamento ?
                        <GreenButton className={classes.activityButton} id="exercicioAprofundamento" variant="contained" color="primary" onClick={handleClickOpen}>Exercícios de Aprofundamento</GreenButton>
                        : 
                        <Button className={classes.activityButton} id="exercicioAprofundamento" variant="outlined" color="primary" onClick={handleClickOpen}>Exercícios de Aprofundamento</Button>
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
        </Accordion>
    )
}
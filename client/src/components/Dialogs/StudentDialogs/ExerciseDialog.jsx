import React, { useEffect, useState } from 'react';
import api from '../../../api';

// -- Material UI Components
import { AppBar, Dialog, Grid, IconButton, Slide, Toolbar, Typography } from '@material-ui/core';

// -- Components
import { useStyles } from '../../../assets/styles/classes';
import { ActivityCard } from '../../'

// -- Icons
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
}); 

export default function ExerciseDialog(props) {
    const { topicoID, open, setOpen, setCheck, title, name, activityType, progresso, setProgresso } = props;
    const classes = useStyles();

    const [activity, setActivity] = useState([]);
    const [question, setQuestion] = useState([]); 

    // -- Carrega as atividades do tópico correspondente
    useEffect(() => {
        const abortController = new AbortController();
        if (open && topicoID !== '') {
            async function fetchAtividadeAPI() {
                console.log("here")
                const response = await api.listarAtividadesPorTopico(topicoID);
                const value = response.data.data;
                let aux = value.filter(item => {
                    return item.tipoAtividade === activityType;
                })
                setActivity(aux);
                setQuestion(aux.questoes);
            }
            fetchAtividadeAPI();
        }
        return abortController.abort();
    }, [topicoID] )

    const handleClose = (event) => {
        setOpen(preValue => ({
            ...preValue,
            [name]: false
        }))
    };

    const handleFinalized = (event) => {
        const name = event.target.offsetParent.id;
        setCheck(preValue => ({
            ...preValue,
            [name]: true
        }));
        setProgresso(progresso+1);
    };

    return (
        <Dialog fullScreen={true} open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                <IconButton id="exercicioAprofundamento" edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
                </Toolbar>
            </AppBar>

            <Grid container={true} spacing={3}>
                <Grid item={true} xs={12} lg={12} sm={12} align='center'>
                    {
                        // (question.length > 0) && <ActivityCard atividadeID={activity[0]._id} handleClose={handleClose} handleFinalized={handleFinalized} question={question}/>
                    }
                </Grid>
            </Grid>
        </Dialog>
    )
}
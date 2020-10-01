import React, { useEffect, useState } from 'react';
import api from '../../../api';

// -- Material UI Components
import { AppBar, Dialog, Grid, IconButton, Slide, Toolbar, Typography } from '@material-ui/core';

// -- Components
import { useStyles } from '../../../assets/styles/classes';
import { ActivityCard } from '../../'

// -- Icons
import CloseIcon from '@material-ui/icons/Close';

// -- Dados iniciais da constante Atividade
const initialState = {
    alunoID: "",
    atividadeID: "",
    revisaoID: "",
    respostaQuestaoID: []
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
}); 

export default function ExerciseDialog(props) {
    const { activity, open, setOpen, setCheck, title, name, progresso, setProgresso } = props;
    const classes = useStyles();

    const [question, setQuestion] = useState([]); 
    const [respostaAluno, setRespostaAluno] = useState(initialState);

    async function fetchQuestaoAPI(atividadeID) {
        const resQuestao = await api.encQuestoesDaAtividadeID(atividadeID);
        const valQuestao = resQuestao.data.data;
        let questao = valQuestao.map(item => { return item.questaoID });
        setQuestion(questao);
    }

    // -- Carrega as atividades do tópico correspondente
    useEffect(() => {
        const abortController = new AbortController();
        console.log(activity)
        if (open && activity) {
            fetchQuestaoAPI(activity._id);
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [activity, open] )

    useEffect(() => {
        const abortController = new AbortController();
        setRespostaAluno(respostaAluno);
        return abortController.abort();
        // eslint-disable-next-line
    }, [respostaAluno])

    const handleClose = (event) => {
        setOpen(preValue => ({
            ...preValue,
            [name]: false
        }))
    };

    const handleFinalized = (event) => {
        setCheck(preValue => ({
            ...preValue,
            [name]: true
        }));
        setProgresso(progresso+1);

        // api
        //     .inserirRespostaAluno(respostaAluno)
        //     .then(res => {
        //         console.log(res.data);
        //     })
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
                    (question.length > 0) 
                        ? <ActivityCard atividadeID={activity._id} handleClose={handleClose} handleFinalized={handleFinalized} respostaAluno={respostaAluno} setRespostaAluno={setRespostaAluno} question={question}/>
                        : null
                }
                </Grid>
            </Grid>
        </Dialog>
    )
}
import React, { useContext, useEffect, useState } from 'react';
import api from '../../../api';

// -- Material UI Components
import { AppBar, Dialog, Grid, IconButton, Slide, Toolbar, Typography } from '@material-ui/core';

// -- Components
import { StoreContext } from '../../../utils';
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
    const { activity, open, setOpen, setCheck, title, name, progresso, setProgresso, setWasChecked, setAnswered, answered } = props;
    const classes = useStyles();
    const [question, setQuestion] = useState([]); 
    const [respostaAluno, setRespostaAluno] = useState(initialState);
    const token = useContext(StoreContext);

    // -- Fetch das questões
    async function fetchQuestaoAPI(atividadeID) {
        const response = await api.encQuestoesDaAtividadeID(atividadeID);
        const value = response.data.data;
        let questao = value.map(item => { return item.questaoID });
        setQuestion(questao);
    }

    // -- Carrega as questões da atividade
    useEffect(() => {
        const abortController = new AbortController();
        if (open && activity) {
            fetchQuestaoAPI(activity._id);
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [activity, open] )

    // -- Confirma salvamento das Respostas do aluno
    useEffect(() => {
        const abortController = new AbortController();
        const alunoID = token.token.userID;
        setRespostaAluno(respostaAluno);
        return abortController.abort();
        // eslint-disable-next-line
    }, [respostaAluno])

    // -- Fechamento do card
    const handleClose = (event) => {
        setOpen(preValue => ({
            ...preValue,
            [name]: false
        }))
    };

    // -- Finalização da atividade
    const handleFinalized = () => {
        setCheck(preValue => ({
            ...preValue,
            [name]: true
        }));
        setProgresso(progresso+1);
        setWasChecked(true);
        handleClose();
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
                        ? <ActivityCard 
                            atividadeID={activity.tipoAtividade === 'Avaliação Diagnóstica' ? undefined : activity._id} 
                            revisaoID={activity.tipoAtividade !== 'Avaliação Diagnóstica' ? undefined : activity._id} 
                            name={name} 
                            handleClose={handleClose} 
                            handleFinalized={handleFinalized} 
                            respostaAluno={respostaAluno} 
                            setRespostaAluno={setRespostaAluno} 
                            question={question}
                            answered={answered}
                        />
                        : null
                }
                </Grid>
            </Grid>
        </Dialog>
    )
}
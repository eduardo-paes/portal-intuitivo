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
    const { topicoID, open, setOpen, setCheck, title, name, activityType, progresso, setProgresso } = props;
    const classes = useStyles();

    const [activity, setActivity] = useState([]);
    const [question, setQuestion] = useState([]); 
    const [ respostaAluno, setRespostaAluno ] = useState(initialState);

    async function fetchAtividadeAPI() {
        const resAtividade = await api.listarAtividadesPorTopico(topicoID);
        const valAtividade = resAtividade.data.data;
        let atividade = valAtividade.filter(item => item.tipoAtividade === activityType);
        setActivity(atividade);
        fetchQuestaoAPI(atividade[0]._id);
    }

    async function fetchQuestaoAPI(atividadeID) {
        const resQuestao = await api.encQuestoesDaAtividadeID(atividadeID);
        const valQuestao = resQuestao.data.data;
        let questao = valQuestao.map(item => { return item.questaoID });
        setQuestion(questao);
    }

    // -- Carrega as atividades do tópico correspondente
    useEffect(() => {
        const abortController = new AbortController();
        if (open && topicoID !== '') {
            fetchAtividadeAPI();
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [topicoID, open] )

    useEffect(() => {
        const abortController = new AbortController();
        
        setRespostaAluno(respostaAluno);
        console.log(respostaAluno)

        return abortController.abort();
        // eslint-disable-next-line
    }, [respostaAluno])

    const handleClose = (event) => {
        setOpen(preValue => ({
            ...preValue,
            [name]: false
        }))
    };

<<<<<<< HEAD
    const handleFinalized = (event) => {
=======
    const handleFinalized = (name) => {
>>>>>>> 16427d511e4cba2760533a41b88b49aec7cf87e9
        setCheck(preValue => ({
            ...preValue,
            [name]: true
        }));
<<<<<<< HEAD
=======
        
>>>>>>> 16427d511e4cba2760533a41b88b49aec7cf87e9
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
<<<<<<< HEAD
                    (question.length > 0) 
                        ? <ActivityCard atividadeID={activity._id} handleClose={handleClose} handleFinalized={handleFinalized} question={question}/>
                        : null
=======
                    (question.length > 0) ? 
                        <ActivityCard 
                            atividadeID={activity._id} 
                            handleClose={handleClose} 
                            handleFinalized={handleFinalized} 
                            question={question}
                            setRespostaAluno={setRespostaAluno}
                            respostaAluno={respostaAluno}
                        />
                    : null
>>>>>>> 16427d511e4cba2760533a41b88b49aec7cf87e9
                }
                </Grid>
            </Grid>
        </Dialog>
    )
}
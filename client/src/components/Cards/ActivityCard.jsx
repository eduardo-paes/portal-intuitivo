import React, { useContext, useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';

// -- Local Components / Styles
import { StoreContext } from '../../utils';
import { QuestionCard } from '../';
import { useStyles } from './styles';

// -- Material UI
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import api from '../../api';

export default function ActivityCard(props) {
    const { handleClose, handleFinalized, question, atividadeID, revisaoID, name } = props;
    const token = useContext(StoreContext);
    const [value, setValue] = useState(1);
    const [answered, setAnswered] = useState(false);
    const [respostaQuestaoIDs, setRespostaQuestaoIDs] = useState([]);
    const [respostaQuestao, setRespostaQuestao] = useState([]);
    const isEssay = (name === 'redacao') ? true : false;
    
    // MediaQuery / Styles
    const classes = useStyles();
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

    let arrayAux = [];
    let gabarito = [];
    question.forEach((row, index) => {
        let gab = row.resposta.find(element => element.gabarito === true);
        let quest = row._id;
        return gabarito[index] = { gab, quest }
    });

    // Passa para a próxima questão e salva a resposta do aluno na questão anterior;
    async function incrementValue () {
        
        await api.atualizarRespostaQuestao(respostaQuestao._id, respostaQuestao);
        setValue(value+1);
    }

    // Passa para volta pra questão anterior e salva a resposta do aluno na questão passada;
    async function decrementValue () {

        await api.atualizarRespostaQuestao(respostaQuestao._id, respostaQuestao);
        setValue(value-1);
    }

    const handleSubmit = async () => {
        const respostaQuestaoID = ["5f7b7d2f59e6cd1464b8dc78", "5f7b8341584bec14f3aaa61a", "5f7b83c3584bec14f3aaa61b"]
        const alunoID = token.token.userID;
        const respostaAluno = {
            alunoID,
            atividadeID,
            revisaoID,
            respostaQuestaoID
        }
        await api.inserirRespostaAluno(respostaAluno);
        handleFinalized();
    };

    // Retorna card com as questões na versão desktop
    function retDesktopQuestionCard() {
        return (
            <div key={value}>                        
                <Typography variant="h6" hidden={name === 'redacao' ? true : false} className={classes.title}>{"Questão " + (value)}</Typography>
                <QuestionCard 
                    idQuestion={question[value-1]._id}
                    enunciado={question[value-1].enunciado} 
                    tipoResposta={question[value-1].tipoResposta} 
                    padraoResposta={question[value-1].padraoResposta} 
                    resposta={question[value-1].resposta}
                    gabarito={gabarito[value-1]}
                    setRespostaQuestaoIDs={setRespostaQuestaoIDs}
                    respostaQuestaoIDs={respostaQuestaoIDs}
                    atividadeID={atividadeID}
                    revisaoID={revisaoID}
                    respostaQuestao={respostaQuestao}
                    setRespostaQuestao={setRespostaQuestao}
                    alunoID={token.token.userID}
                    name={name}
                />
            </div>
        );
    }

    return (
        <Grid container={true} className={classes.question}>
            {/* Voltar para Esquerda */}
            <Grid align="left" hidden={isEssay} item={true} xs={1} lg={1} sm={1}>
                <IconButton className={classes.backArrow} color="primary" disabled={ value === 1 ? true : false } onClick={decrementValue}>
                    <ArrowBackIcon className={classes.arrow}/>
                </IconButton>
            </Grid>

            {/* QuestionCard */}
            <Grid className={classes.question} align="center" item={true} xs={isEssay ? 12 : 10} lg={isEssay ? 12 : 10} sm={isEssay ? 12 : 10}>
                { 
                    !smScreen 
                        ? retDesktopQuestionCard()
                        : <SwipeableViews animateHeight={true} className={classes.swipeableViews} enableMouseEvents> 
                            {
                                question.map((row, index) => {
                                    return ( 
                                        <div className={classes.questionCardDiv} key={index}>                        
                                            <Typography variant="h6" hidden={isEssay} className={classes.title}>{"Questão " + (index+1)}</Typography>
                                            <QuestionCard 
                                                idQuestion={row._id}
                                                enunciado={row.enunciado} 
                                                tipoResposta={row.tipoResposta} 
                                                padraoResposta={row.padraoResposta} 
                                                resposta={row.resposta}
                                                gabarito={gabarito[index]}
                                                setRespostaQuestao={setRespostaQuestao}
                                                respostaQuestao={respostaQuestao}
                                                atividadeID={atividadeID}
                                                revisaoID={revisaoID}
                                                alunoID={token.token.userID}
                                                name={name}
                                            />
                                        </div>            
                                    );
                                })
                            } 
                        </SwipeableViews>
                }
            </Grid>

            {/* Continuar para Direita */}
            <Grid align="rigth" hidden={isEssay} item={true} xs={1} lg={1} sm={1}>
                <IconButton className={classes.forwardArrow} size="medium" color="primary" disabled={ value === question.length ? true : false } onClick={incrementValue}>
                    <ArrowForwardIcon className={classes.arrow}/>
                </IconButton>
            </Grid>

            {/* Rodapé */}
            <Grid item={true} xs={12} lg={12} sm={12} align='center' >                        
                <Button className={classes.buttons} variant='contained' color="primary" onClick={handleClose}>
                    Voltar
                </Button>
                { 
                    value === question.length && !isEssay
                        ? <Button className={classes.buttons} variant='contained' color="primary" onClick={handleSubmit}> Concluir Atividade </Button>
                        : null
                }
            </Grid> 
        </Grid>
    )
}
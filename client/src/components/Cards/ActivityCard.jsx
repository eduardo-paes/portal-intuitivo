import React, { useContext, useState } from 'react';
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
import { useEffect } from 'react';

export default function ActivityCard(props) {
    const { handleClose, handleFinalized, question, atividadeID, revisaoID, name, answered, respostas } = props;
    const token = useContext(StoreContext);
    const [wasLoaded, setWasLoaded] = useState(false);
    const [value, setValue] = useState(1);
    const [flag, setFlag] = useState(false);
    const [respostaQuestaoIDs, setRespostaQuestaoIDs] = useState([]);
    const [respostaQuestao, setRespostaQuestao] = useState([]);
    const [gabarito, setGabarito] = useState([]);
    const isEssay = (name === 'redacao') ? true : false;
    
    // MediaQuery / Styles
    const classes = useStyles();
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Guarda informação das respostas da questão (quest: ID da resposta / gab: Gabarito da Questão)
    useEffect(() => {
        const abortController = new AbortController();
        if (question) {
            let gabAux = [];
            question.forEach((row, index) => {
                if (row.tipoResposta !== 'multiplaEscolha') setFlag(true);
                let gab = row.resposta.find(element => element.gabarito === true);
                let quest = row._id;
                return gabAux[index] = { gab, quest }
            });
            setGabarito(gabAux);
        }
        return abortController.abort();
        // eslint-disable-next-line
    },[question])
    
    // Função para verificar se a atividade já foi respondida pelo aluno ou não
    function verificaProgresso() {
        if (revisaoID) return answered.progresso;
        if (isEssay)  return answered.progresso;
        if (atividadeID && answered.progresso) {
            if (name === 'exercicioFixacao') return answered.progresso.exercicioFixacao;
            if (name === 'exercicioRetomada') return answered.progresso.exercicioRetomada;
            if (name === 'exercicioAprofundamento') return answered.progresso.exercicioAprofundamento;
        } 
        return false;
    }
    
    // Passa para a próxima questão e salva a resposta do aluno na questão anterior;
    async function incrementValue () {
        await api.atualizarRespostaQuestao(respostaQuestao._id, respostaQuestao);
        setValue(value+1);
    }
    
    // Volta pra questão anterior e salva a resposta do aluno na questão passada;
    async function decrementValue () {
        await api.atualizarRespostaQuestao(respostaQuestao._id, respostaQuestao);
        setValue(value-1);
    }
    
    async function correctActivity() {
        var resultado = 0;
        for (let index = 0; index < respostaQuestaoIDs.length; index++) {
            const response = await api.encRespostaQuestaoPorID(respostaQuestaoIDs[index]);
            resultado += response.data.data.nota;
        }
        return resultado*100/respostaQuestaoIDs.length;
    }
    
    const handleSubmit = async () => {
        await api.atualizarRespostaQuestao(respostaQuestao._id, respostaQuestao);
        const alunoID = token.token.userID;

        if (!flag) var nota = await correctActivity();
        const respostaAluno = {
            alunoID,
            atividadeID,
            revisaoID,
            respostaQuestaoIDs,
            nota,
            corrigido: !flag
        }
        await api.inserirRespostaAluno(respostaAluno);
        handleFinalized();
    };
    
    const voltar = async () => {
        await api.atualizarRespostaQuestao(respostaQuestao._id, respostaQuestao);
        handleClose();
    }
    
    // Retorna card com as questões na versão desktop
    function retDesktopQuestionCard() {   
        return (
            <div key={value}>                        
                <Typography variant="h6" className={classes.title}>{isEssay ? "Enunciado" : "Questão " + (value)}</Typography>
                {
                    (gabarito.length > 0) &&
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
                        answered={verificaProgresso()}
                        />
                }
            </div>
        );
    }

    return (
        <Grid container={true} justify="center" className={classes.question}>
            {/* Voltar para Esquerda */}
            <Grid align="left" hidden={isEssay} item={true} xs={1} lg={1} sm={1}>
                <IconButton className={classes.backArrow} color="primary" disabled={ value === 1 ? true : false } onClick={decrementValue}>
                    <ArrowBackIcon className={classes.arrow}/>
                </IconButton>
            </Grid>

            {/* QuestionCard */}
            
            <Grid className={classes.question} align="center" item={true} xs={isEssay ? 11 : 10} lg={isEssay ? 11 : 10} sm={isEssay ? 11 : 10}>
                { 
                    !smScreen
                        ? retDesktopQuestionCard()
                        : <SwipeableViews animateHeight={true} className={classes.swipeableViews} enableMouseEvents> 
                            {
                                question.map((row, index) => {
                                    return (
                                        <div className={classes.questionCardDiv} key={index}>                        
                                            <Typography variant="h6" className={classes.title}>{isEssay ? "Enunciado" : "Questão " + (index+1)}</Typography>
                                            <QuestionCard 
                                                idQuestion={row._id}
                                                atividadeID={atividadeID}
                                                enunciado={row.enunciado} 
                                                alunoID={token.token.userID}
                                                tipoResposta={row.tipoResposta} 
                                                padraoResposta={row.padraoResposta} 
                                                resposta={row.resposta}
                                                gabarito={gabarito[index]}
                                                setRespostaQuestao={setRespostaQuestao}
                                                respostaQuestao={respostaQuestao}
                                                setRespostaQuestaoIDs={setRespostaQuestaoIDs}
                                                respostaQuestaoIDs={respostaQuestaoIDs}
                                                revisaoID={revisaoID}
                                                name={name}
                                                answered={verificaProgresso()}
                                                mobile={smScreen}
                                                respostaMobile={respostas[index]}
                                            />
                                        </div>
                                    )
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
                <Button className={classes.buttons} variant='contained' color="primary" onClick={voltar}>
                    Voltar
                </Button>
                { 
                    value === question.length && !isEssay && !verificaProgresso()
                        ? <Button className={classes.buttons} variant='contained' color="primary" onClick={handleSubmit}>{smScreen ? 'Concluir' : 'Concluir Atividade'}</Button>
                        : null
                }
            </Grid> 
        </Grid>
    )
}
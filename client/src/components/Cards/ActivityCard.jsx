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

export default function ActivityCard(props) {
    const { handleClose, handleFinalized, question, atividadeID, revisaoID, respostaAluno, setRespostaAluno } = props;
    const token = useContext(StoreContext);
    const [value, setValue] = useState(1);
    const [flag, setFlag] = useState(false);
    const [respostaQuestao, setRespostaQuestao] = useState([]);
    const [teste, setTeste] = useState([]);
    
    // MediaQuery / Styles
    const classes = useStyles();
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

    let gabarito = [];
    question.forEach((row, index) => {
        let gab = row.resposta.find(element => element.gabarito === true);
        let quest = row._id;
        return gabarito[index] = { gab, quest }
    });

    // Salva Resposta do Aluno
    function settingAnswer(aux) {
        setRespostaAluno(prevValue => ({
            ...prevValue,
            respostaQuestaoID: aux
        }));
    }

    // Pega dados da resposta do aluno e prepara para salvamento
    useEffect(() => {
        const abortController = new AbortController();
        
        if ()

        // if (flag === true) {
        //     const alunoID = token.token.userID;
        //     let aux = [];
        //     Object.entries(respostaQuestao).map((row, index) => {
        //         let nota = 0;
        //         let gab = gabarito.find(element => element.quest === row[0]);
                
        //         if (gab.gab) {
        //             if( gab.gab._id === row[1] ) nota = 1;
        //         }    
                
        //         aux[index] = {
        //             alunoID,
        //             questaoID: row[0],
        //             resposta: row[1],
        //             nota
        //         }   

        //         return null;
        //     });
        //     settingAnswer(aux);
        // }

        return abortController.abort();
        // eslint-disable-next-line
    }, [flag])

    // Obrigado atualização
    useEffect(() => {
        const abortController = new AbortController();
        setRespostaAluno(respostaAluno);
        return abortController.abort();
        // eslint-disable-next-line
    }, [respostaAluno])

    const handleSubmit = () => {
        const alunoID = token.token.userID;
        console.log(respostaAluno);
        setRespostaAluno((prevValue) => ({
            ...prevValue,
            alunoID,
            atividadeID,
            revisaoID
        }))
        setFlag(true);
        handleFinalized();
    };

    // Retorna card com as questões na versão desktop
    function retDesktopQuestionCard() {
        return (
            <div key={value}>                        
                <Typography variant="h6" className={classes.title}>{"Questão " + (value)}</Typography>
                <QuestionCard 
                    idQuestion={question[value-1]._id}
                    enunciado={question[value-1].enunciado} 
                    tipoResposta={question[value-1].tipoResposta} 
                    padraoResposta={question[value-1].padraoResposta} 
                    resposta={question[value-1].resposta}
                    gabarito={gabarito[value-1]}
                    setRespostaQuestao={setRespostaQuestao}
                    respostaQuestao={respostaQuestao}
                    atividadeID={atividadeID}
                    teste={teste}
                    setTeste={setTeste}
                />
            </div>
        );
    }

    return (
        <Grid container={true} className={classes.question}>
            {/* Voltar para Esquerda */}
            <Grid align="left" item={true} xs={1} lg={1} sm={1}>
                <IconButton className={classes.backArrow} color="primary" disabled={ value === 1 ? true : false } onClick={() => setValue(value-1)}>
                    <ArrowBackIcon className={classes.arrow}/>
                </IconButton>
            </Grid>

            {/* QuestionCard */}
            <Grid className={classes.question} align="center" item={true} xs={10} lg={10} sm={10}>
                { 
                    !smScreen 
                        ? retDesktopQuestionCard()
                        : <SwipeableViews animateHeight={true} className={classes.swipeableViews} enableMouseEvents> 
                            {
                                question.map((row, index) => {
                                    return ( 
                                        <div className={classes.questionCardDiv} key={index}>                        
                                            <Typography variant="h6" className={classes.title}>{"Questão " + (index+1)}</Typography>
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
                                            />
                                        </div>            
                                    );
                                })
                            } 
                        </SwipeableViews>
                }
            </Grid>

            {/* Continuar para Direita */}
            <Grid align="rigth" item={true} xs={1} lg={1} sm={1}>
                <IconButton className={classes.forwardArrow} size="medium" color="primary" disabled={ value === question.length ? true : false } onClick={() => {setValue(value+1)}}>
                    <ArrowForwardIcon className={classes.arrow}/>
                </IconButton>
            </Grid>

            {/* Rodapé */}
            <Grid item={true} xs={12} lg={12} sm={12} align='center' >                        
                <Button className={classes.buttons} variant='contained' color="primary" onClick={handleClose}>
                    Voltar
                </Button>
                { 
                    value === question.length 
                        ? <Button className={classes.buttons} variant='contained' color="primary" onClick={handleSubmit}> Concluir Atividade </Button>
                        : null
                }
            </Grid> 
        </Grid>
    )
}
import React, { useContext, useState, useEffect } from 'react';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import QuestionCard from './QuestionCard';
import { useStyles } from './styles';
import { StoreContext } from '../../utils';
import SwipeableViews from 'react-swipeable-views';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';


export default function ActivityCard(props) {
    const token = useContext(StoreContext);
    const classes = useStyles();
    const { handleClose, handleFinalized, question, atividadeID, revisaoID, respostaAluno, setRespostaAluno } = props;
    const [ value, setValue ] = useState(1);
    const [ flag, setFlag ] = useState(false);
    const [ respostaQuestao, setRespostaQuestao ] = useState([]);

    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

    let gabarito = [];
    
    question.map((row, index) => {
        let gab = row.resposta.find(element => element.gabarito === true);
        let quest = row._id;
        
        gabarito[index] = { 
            gab,
            quest
        } 

        return null;
    });

    useEffect(() => {
        
        const abortController = new AbortController();
        
        if (flag === true) {
            
            const alunoID = token.token.userID;
            let aux = [];
            
            Object.entries(respostaQuestao).map((row, index) => {
            
                let nota = 0;
                let gab = gabarito.find(element => element.quest === row[0]);
                
                if (gab.gab) {
                    if( gab.gab._id === row[1] ) nota = 1;
                }    
                
                aux[index] = {
                    alunoID,
                    questaoID: row[0],
                    resposta: row[1],
                    nota
                }   

                return null;
            });

            async function settingAnswer(aux) {
                await setRespostaAluno(prevValue => ({
                    ...prevValue,
                    respostaQuestaoID: aux
                }));
            }

            console.log(aux);

            settingAnswer(aux);
        }

        return abortController.abort();
        // eslint-disable-next-line
    }, [flag])

    useEffect(() => {
        const abortController = new AbortController();
        
        setRespostaAluno(respostaAluno);
        // console.log(respostaAluno)

        return abortController.abort();
        // eslint-disable-next-line
    }, [respostaAluno])

    const handleSubmit = async event => {

        const name = event.target.offsetParent.id;
        const alunoID = token.token.userID;

        setRespostaAluno((prevValue) => ({
            ...prevValue,
            alunoID,
            atividadeID,
            revisaoID
        }))

        await setFlag(true);
        
        handleFinalized(name);
    };

    function returnQuestionCard() {
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
                />
            </div>
        );
    }

    return (
        <Grid container={true} spacing={0}>
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
                        ? returnQuestionCard()
                        : <SwipeableViews enableMouseEvents> 
                            {
                                question.map((row, index) => {
                                    return ( 
                                        <div key={index}>                        
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
                <Grid item={true} xs={12} lg={12} sm={12} align='center' >                        
            <Grid item={true} xs={12} lg={12} sm={12} align='center' >                        
                <Button className={classes.buttons} variant='contained' color="primary" onClick={handleClose}>
                    Voltar
                </Button>
                { 
                    value === question.length 
                    ? <Button className={classes.buttons} id="exercicioFixacao" variant='contained' color="primary" onClick={handleSubmit}> Concluir Atividade </Button>
                    : null
                }
            </Grid> 
                </Grid> 
            </Grid> 
        </Grid>
    )
}
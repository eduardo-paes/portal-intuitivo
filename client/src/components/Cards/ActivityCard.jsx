import React, { useContext, useState, useEffect } from 'react';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import QuestionCard from './QuestionCard';
import { useStyles } from './styles';
import { StoreContext } from '../../utils';
import { useSwipeable, Swipeable } from 'react-swipeable';
import SwipeableViews from 'react-swipeable-views';
import api from '../../api';

const RIGHT = "-1";
const LEFT = "+1";

export default function ActivityCard(props) {

    const token = useContext(StoreContext);
    
    const classes = useStyles();
    const { handleClose, handleFinalized, question, atividadeID, revisaoID, respostaAluno, setRespostaAluno } = props;
    const [ value, setValue ] = useState(1);
    const [ flag, setFlag ] = useState(false);
    const [ respostaQuestao, setRespostaQuestao ] = useState([]);
    const [ novaRespostaQuestao, setNovaRespostaQuestao ] = useState([]);
    const config = useSwipeable({ 
        onSwipedLeft: () => onSwiped(LEFT),
        onSwipedRight: () => onSwiped(RIGHT),
        preventDefaultTouchmoveEvent: true,
        trackMouse: false,
        trackTouch: true
    });
    let gabarito = [];
    
    question.map((row, index) => {
        let gab = row.resposta.find(element => element.gabarito === true);
        let quest = row._id;
        
        gabarito[index] = { 
            gab,
            quest
        }
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
        console.log(respostaAluno)

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


    function decrementValue () {
        console.log(value);
        setValue(value-1);
    }

    function incrementValue () {
        console.log(value);
        setValue(value+1);
    }

    function onSwiped(direction) {
        if (direction === RIGHT) decrementValue();
        else if (direction === LEFT) incrementValue();
      }

    return (
        <SwipeableViews enableMouseEvents>
            <Grid container={true} spacing={0}>
                {/* Cabeçalho */}
                <Grid align="left" item={true} xs={1} lg={1} sm={1}>
                    <IconButton className={classes.backArrow} color="primary" disabled={ value === 1 ? true : false } onClick={() => {decrementValue()}}>
                        <ArrowBackIcon className={classes.arrow}/>
                    </IconButton>
                </Grid>

                {/* QuestionCard */}
                <SwipeableViews enableMouseEvents>
                    {question.map((row, index) => {
                        return( 
                            <Grid className={classes.question} align="center" item={true} xs={8} lg={8} sm={8}>                                 
                    
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
                            </Grid>            
                        )
                    })}
                </SwipeableViews>

                {/* <Grid className={classes.question} align="center" item={true} xs={8} lg={8} sm={8}>                                 
                    
                    <Typography variant="h6" className={classes.title}>{"Questão " + value}</Typography>
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
                </Grid>          */}
                

                <Grid align="rigth" item={true} xs={1} lg={1} sm={1}>
                    <IconButton className={classes.forwardArrow} size="medium" color="primary" disabled={ value === question.length ? true : false } onClick={() => {incrementValue()}}>
                        <ArrowForwardIcon className={classes.arrow}/>
                    </IconButton>
                </Grid>

                {/* Rodapé */}
                <Grid item={true} xs={12} lg={12} sm={12} align='center' >                        
                    <Button className={classes.buttons} variant='contained' color="primary" onClick={handleClose}>
                        Voltar
                    </Button>
                    { 
                        value === question.length ?
                            <Button className={classes.buttons} id="exercicioFixacao" variant='contained' color="primary" onClick={handleSubmit}>
                                Concluir Atividade
                            </Button>
                        : null
                    }
                </Grid> 
            </Grid>
        </SwipeableViews>
    )
}
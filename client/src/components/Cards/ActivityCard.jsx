import React, { useContext, useState } from 'react';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import QuestionCard from './QuestionCard';
import { useStyles } from './styles';
import { StoreContext } from '../../utils';
import api from '../../api';

export default function ActivityCard(props) {

    const token = useContext(StoreContext);
    
    const classes = useStyles();
    const { handleClose, handleFinalized, question, atividadeID, revisaoID } = props;
    const [ value, setValue ] = useState(1);
    const [ respostaAluno, setRespostaAluno ] = useState([]);
    let gabarito = [{}];
    
    question.map((row, index) => {
        let gab = row.resposta.find(element => element.gabarito === true);
        let quest = row._id;
        gabarito[index] = { 
            gab,
            quest
        }    
    });

    const handleSubmit = event => {
        
        const alunoID = token.token.userID;
        let novaRespostaQuestao = [];
        
        handleFinalized(event);

        Object.entries(respostaAluno).map((row, index) => {
            
            let nota = 0;
            let gab = gabarito.find(element => element.quest === row[0]);

            if (gab.gab) {
                if( gab.gab._id === row[1] ) nota = 1;
            }    

            novaRespostaQuestao[index] = {
                alunoID,
                questaoID: row[0],
                resposta: row[1],
                nota
            }   
        });

        //console.log(novaRespostaQuestao);
        
        const novaRespostaAluno = {
            alunoID,
            atividadeID,
            revisaoID,
            respostaQuestaoID: novaRespostaQuestao
        }
        
        console.log(novaRespostaAluno)

        api
            .inserirRespostaAluno(novaRespostaAluno)
            .then(res => {
                console.log(res.data);
            })

    };

    function decrementValue () {
        //console.log(respostaFinal);
        setValue(value-1);
    }

    function incrementValue () {
        //console.log(gabarito);
        setValue(value+1);
    }

    return (
        <Grid container={true} spacing={0}>
            {/* Cabeçalho */}
            <Grid align="left" item={true} xs={1} lg={1} sm={1}>
                <IconButton className={classes.backArrow} color="primary" disabled={ value === 1 ? true : false } onClick={() => {decrementValue()}}>
                    <ArrowBackIcon className={classes.arrow}/>
                </IconButton>
            </Grid>

            {/* QuestionCard */}
            <Grid className={classes.question} align="center" item={true} xs={8} lg={8} sm={8}>                                 
                <Typography variant="h6" className={classes.title}>{"Questão " + value}</Typography>
                <QuestionCard 
                    idQuestion={question[value-1]._id}
                    enunciado={question[value-1].enunciado} 
                    tipoResposta={question[value-1].tipoResposta} 
                    padraoResposta={question[value-1].padraoResposta} 
                    resposta={question[value-1].resposta}
                    gabarito={gabarito[value-1]}
                    setRespostaAluno={setRespostaAluno}
                    respostaAluno={respostaAluno}
                    atividadeID={atividadeID}
                />
            </Grid>

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
    )
}
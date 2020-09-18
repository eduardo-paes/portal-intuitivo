import { Button, Grid, Slide, Typography } from '@material-ui/core';
import React from 'react';
import DiscreteSlider from '../Sliders/DiscreteSlider';
import QuestionCard from './QuestionCard';
import {useStyles} from '../../assets/styles/classes';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='left' ref={ref} timeout={10000} mountOnEnter unmountOnExit/>;
}); 

export default function ActivityCard(props) {
    
    const classes = useStyles();
    const { handleClose, handleFinalized, question } = props;
    const [ value, setValue ] = React.useState(1);
    const [ respostaAluno, setRespostaAluno ] = React.useState([]);
    let gabarito = [];
    
    question.map((row, index) => {
        gabarito[index] = row.resposta.find(element => element.gabarito === true);
    })

    const handleSubmit = (event) => {
        console.log(respostaAluno);
        console.log(gabarito);
        //handleFinalized();    
    };

    return (
        <Grid container={true} spacing={0}>
            <Grid className={classes.question} align="center" item={true} xs={12} lg={12} sm={12}>                                    
                <Typography variant="h6" className={classes.title}>{"Questão " + value}</Typography>
                <QuestionCard 
                    idQuestion={question[value-1]._id}
                    enunciado={question[value-1].enunciado} 
                    tipoResposta={question[value-1].tipoResposta} 
                    padraoResposta={question[value-1].padraoResposta} 
                    resposta={question[value-1].resposta}
                    gabarito={gabarito[value-1]}
                    TransitionComponent={Transition}
                    setRespostaAluno={setRespostaAluno}
                />
            </Grid>
            <Grid className={classes.question} align="center" item={true} xs={12} lg={12} sm={12}>
                <DiscreteSlider valor={value} setValor={setValue} max={question.length}/>
            </Grid>
            <Grid item={true} xs={12} lg={12} sm={12} align='center' >                        
                <Button className={classes.buttons} autoFocus variant='contained' color="primary" onClick={handleClose}>
                    Voltar
                </Button>
                { 
                    value === question.length ?
                        <Button className={classes.buttons} id="exercicioFixacao" autoFocus variant='contained' color="primary" onClick={handleSubmit}>
                            Concluir Atividade
                        </Button>
                    : null
                }
            </Grid> 
        </Grid>
    )
}
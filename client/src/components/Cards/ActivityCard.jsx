import { Grid, Slide, Typography } from '@material-ui/core';
import React from 'react';
import DiscreteSlider from '../Sliders/DiscreteSlider';
import QuestionCard from './QuestionCard';
import {useStyles} from '../../assets/styles/classes';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='left' ref={ref} timeout={10000} mountOnEnter unmountOnExit/>;
}); 

export default function ActivityCard(props) {
    
    const classes = useStyles();
    const { question } = props;
    const [ value, setValue ] = React.useState(1);
    const [ direction, setDirection ] = React.useState('left');

    console.log(Transition);

    return (
        <Grid container={true} spacing={0}>
            <Grid className={classes.question} align="center" item={true} xs={12} lg={12} sm={12}>                                    
                <Typography variant="h6" className={classes.title}>{"Questão " + value}</Typography>
                <QuestionCard 
                    enunciado={question[value-1].enunciado} 
                    tipoResposta={question[value-1].tipoResposta} 
                    padraoResposta={question[value-1].padraoResposta} 
                    resposta={question[value-1].resposta}
                    TransitionComponent={Transition}
                />
            </Grid>
            <Grid className={classes.question} align="center" item={true} xs={12} lg={12} sm={12}>
                <DiscreteSlider setDirection={setDirection} valor={value} setValor={setValue} max={question.length}/>
            </Grid>
        </Grid>
    )
}
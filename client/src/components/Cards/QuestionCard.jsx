import React from "react";
import "./QuestionStyles.css"
import { MyCardContent } from "../../assets/styles/styledComponents"
import RadioAnswer from "../Radio/RadioAnswer";
import { Grid, TextareaAutosize } from "@material-ui/core";
import {useStyles} from '../../assets/styles/classes';

export default function QuestionCard (props) {

    const classes = useStyles();
    const { enunciado, tipoResposta, padraoResposta, resposta } = props;
    const [value, setValue] = React.useState(0);
    const [answered, setAnswered] = React.useState(false);
    const [color, setColor] = React.useState('default');

    let gabarito = resposta.find(element => element.gabarito === true);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (value === gabarito._id) {
            setColor("primary");
            } else if (value !== gabarito._id && value !== '') {
            setColor("secondary");
            } else {
            setColor("default");
            }
            setAnswered(true);
    };

    return (
        <MyCardContent>
            <Grid container={true} spacing={0}>
                <Grid className={classes.questionText} item={true} align="left" xs={12} lg={12} sm={12}>
                    <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: enunciado}} />
                </Grid>
                <Grid className={classes.answer} item={true} align="left" xs={12} lg={12} sm={12}>
                    { 
                        (tipoResposta === "multiplaEscolha") ? 
                        <RadioAnswer value={value} setValue={setValue} answered={answered} gabarito={gabarito._id} color={color} resposta={resposta}/>
                        : (tipoResposta === "discursiva") ?
                        <TextareaAutosize/>
                        : null
                    }
                </Grid>
            </Grid>
        </MyCardContent>
    );
}
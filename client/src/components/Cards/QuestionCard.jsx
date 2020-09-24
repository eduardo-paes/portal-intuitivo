import React from "react";
import "./QuestionStyles.css"
import { MyCardContent } from "../../assets/styles/styledComponents"
import RadioAnswer from "../Radio/RadioAnswer";
import { Grid, TextField } from "@material-ui/core";
import {useStyles} from '../../assets/styles/classes';

export default function QuestionCard (props) {

    const classes = useStyles();
    const { idQuestion, enunciado, tipoResposta, gabarito, padraoResposta, resposta, setRespostaAluno } = props;
    const [value, setValue] = React.useState(0);
    const [answered, setAnswered] = React.useState(false);
    const [color, setColor] = React.useState('default');
    
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
                <Grid className={classes.answer} container={true} spacing={2}>
                    { 
                        (tipoResposta === "multiplaEscolha") ? 
                        <Grid className={classes.questionText} item={true} align="left" xs={12} lg={12} sm={12}>
                            <RadioAnswer idQuestion={idQuestion} setRespostaAluno={setRespostaAluno} value={value} setValue={setValue} answered={answered} gabarito={gabarito._id} color={color} resposta={resposta}/>
                        </Grid>
                        : (tipoResposta === "discursiva") ?
                        <Grid className={classes.questionText} item={true} align="center" xs={12} lg={12} sm={12}>
                            <TextField
                                className={classes.answerField}
                                id="standard-textarea"
                                label="Resposta"
                                placeholder=""
                                multiline
                            />
                        </Grid>
                        : null
                    }
                </Grid>
            </Grid>
        </MyCardContent>
    );
}
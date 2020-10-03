import React, { useEffect } from "react";
import "./QuestionStyles.css"
import { MyCardContent } from "../../assets/styles/styledComponents"
import RadioAnswer from "../Radio/RadioAnswer";
import { Grid, TextField } from "@material-ui/core";
import {useStyles} from '../../assets/styles/classes';

export default function QuestionCard (props) {

    const classes = useStyles();
    const { idQuestion, enunciado, tipoResposta, gabarito, padraoResposta, resposta, respostaQuestao, setRespostaQuestao, teste, setTeste } = props;
    const [value, setValue] = React.useState(0);
    const [answered, setAnswered] = React.useState(false);
    const [color, setColor] = React.useState('default');

    function getAnswer() {
        console.log(idQuestion)
        if (teste) {
            Object.entries(teste).map((row, index) => {
                if (idQuestion === row[0])
                    setValue(row[1]);
            })
        }
    }

    // const handleSubmit = (event) => {
    //     event.preventDefault();
        
    //     if (value === gabarito._id) {
    //         setColor("primary");
    //         } else if (value !== gabarito._id && value !== '') {
    //         setColor("secondary");
    //         } else {
    //         setColor("default");
    //         }
    //         setAnswered(true);
    // };

    useEffect(() => {
        // console.log(teste);
        getAnswer();
    }, [idQuestion])


    function pegarRespostaDiscursiva(event) {
        const { value } = event.target;  
        const id = idQuestion;
        setTeste(prevValue => ({
            ...prevValue,
            [id]: value
        }));
        // setRespostaQuestao((preValue) => ({
        //     ...preValue,
        //       [id]: value
        // }));
    }

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
                            <RadioAnswer 
                                idQuestion={idQuestion} 
                                respostaQuestao={respostaQuestao}
                                setRespostaQuestao={setRespostaQuestao} 
                                value={value} 
                                setValue={setValue} 
                                answered={answered} 
                                gabarito={gabarito._id} 
                                color={color} 
                                resposta={resposta}
                            />
                        </Grid>
                        : (tipoResposta === "discursiva") ?
                        <Grid className={classes.questionText} item={true} align="center" xs={12} lg={12} sm={12}>
                            <TextField
                                className={classes.answerField}
                                id={respostaQuestao.questao}
                                label="Resposta"
                                defaultValue={value ? value : null}
                                multiline
                                value={respostaQuestao.resposta}
                                onChange={pegarRespostaDiscursiva}
                            />
                        </Grid>
                        : null
                    }
                </Grid>
            </Grid>
        </MyCardContent>
    );
}
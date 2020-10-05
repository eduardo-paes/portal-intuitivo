import React, { useEffect } from "react";
import "./QuestionStyles.css"
import { MyCardContent } from "../../assets/styles/styledComponents"
import RadioAnswer from "../Radio/RadioAnswer";
import { Grid, TextField } from "@material-ui/core";
import {useStyles} from '../../assets/styles/classes';
import api from "../../api";

export default function QuestionCard (props) {

    const classes = useStyles();
    const { idQuestion, enunciado, tipoResposta, gabarito, padraoResposta, resposta, respostaQuestao, setRespostaQuestao, teste, setTeste, atividadeID, revisaoID, alunoID } = props;
    const [value, setValue] = React.useState(0);
    const [answered, setAnswered] = React.useState(false);
    const [flag, setFlag] = React.useState(false);
    const [color, setColor] = React.useState('default');
    const [res, setRes] = React.useState();
    const idRQ = getAnswer();

    async function getAnswer() {
        let response;
        
        if (atividadeID) {
            response = await api.encRespostaQuestaoPorAtividade(atividadeID, alunoID, idQuestion);
        } else if (revisaoID) {
            response = await api.encRespostaQuestaoPorRevisao(revisaoID, alunoID, idQuestion);
        }
        
        if (response.data.success === true) {
            setTeste(response.data.data);
            return response.data.data._id;
        }

        return false;
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
    }, [idQuestion]);

    useEffect(() => {
        async function atualizarRQ () {
            const response = getAnswer();
            await api.atualizarRespostaQuestao(response.data.data._id, teste);       
        }
        async function inserirRQ () {
            await api.inserirRespostaQuestao(teste);       
        }
        console.log(teste);
        if (teste.length !== 0) {
            if (idRQ) atualizarRQ(idRQ, teste);
            else inserirRQ(teste);
        } else {
            setTeste(prevValue => ({
                ...prevValue,
                alunoID,
                atividadeID,
                revisaoID,
                questaoID: idQuestion
            }))
        }
    }, [teste]);

    function pegarRespostaDiscursiva(event) {
        const { value } = event.target;  
        setTeste(prevValue => ({
            ...prevValue,
            resposta: value
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
                                value={teste.resposta ? teste.resposta : null} 
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
                                defaultValue={value ? value : ''}
                                multiline
                                value={teste.resposta ? teste.resposta : null}
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
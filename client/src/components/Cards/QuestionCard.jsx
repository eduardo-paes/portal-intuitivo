import React, { useEffect, useState } from "react";

import { Grid, TextField } from "@material-ui/core";
import { MyCardContent } from "../../assets/styles/styledComponents"
import { RadioAnswer } from "../";

import { useStyles } from '../../assets/styles/classes';
import "./QuestionStyles.css"

import api from "../../api";

export default function QuestionCard (props) {
    const classes = useStyles();
    const { idQuestion, enunciado, tipoResposta, gabarito, padraoResposta, resposta, respostaQuestao, setRespostaQuestao, respostaQuestaoIDs, setRespostaQuestaoIDs, atividadeID, revisaoID, alunoID, name } = props;
    const [value, setValue] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [color, setColor] = useState('default');

    // const [flag, setFlag] = useState(false);
    // const [res, setRes] = useState();

    async function atualizarRQ (resposta) {
        const response = getAnswer();
        await api.atualizarRespostaQuestao(response.data.data._id, {resposta});       
    }
    
    async function getAnswer() {
        let response;
        
        if (atividadeID) {
            response = await api.encRespostaQuestaoPorAtividade(atividadeID, alunoID, idQuestion);
        } else if (revisaoID) {
            response = await api.encRespostaQuestaoPorRevisao(revisaoID, alunoID, idQuestion);
        }
        
        if (response.data.success === true) {
            setRespostaQuestao(response.data.data);
            return response.data.data._id;
        }
        
        else {
            await api.inserirRespostaQuestao({
                alunoID,
                atividadeID,
                revisaoID,
                questaoID: idQuestion
            }).then((res) => {
                setRespostaQuestao(res.data.data);
                setRespostaQuestaoIDs(res.data.data._id);
            });
        }
    }
    
    useEffect(() => {
        const abortController = new AbortController();
        getAnswer();
        return abortController.abort();
    }, [idQuestion]);

    function pegarRespostaDiscursiva(event) {
        const {value} = event.target; 
        setRespostaQuestao(prevValue => ({
            ...prevValue,
            resposta: value
        }));
    }

    const returnAnswerOption = () => {
        if (name === 'redacao') {
            return null;
        }
        
        if (tipoResposta === "multiplaEscolha") {
            return (
                <Grid className={classes.questionText} item={true} align="left" xs={12} lg={12} sm={12}>
                    <RadioAnswer 
                        idQuestion={idQuestion} 
                        respostaQuestao={respostaQuestao}
                        setRespostaQuestao={setRespostaQuestao} 
                        value={respostaQuestao.resposta ? respostaQuestao.resposta : ''} 
                        setValue={setValue} 
                        answered={answered} 
                        gabarito={gabarito._id} 
                        color={color} 
                        resposta={resposta}
                        respostaQuestao={respostaQuestao}
                        setRespostaQuestao={setRespostaQuestao}
                    />
                </Grid>
            )
        }
        
        if (tipoResposta === "discursiva") {
            return (
                <Grid className={classes.questionText} item={true} align="center" xs={12} lg={12} sm={12}>
                    <TextField
                        className={classes.answerField}
                        id={respostaQuestao.questao ? respostaQuestao.questao : ''}
                        label="Resposta"
                        defaultValue={value ? value : ''}
                        multiline
                        value={respostaQuestao.resposta ? respostaQuestao.resposta : null}
                        onChange={pegarRespostaDiscursiva}
                    />
                </Grid>
            )
        }
    }

    return (
        <MyCardContent>
            <Grid container={true} spacing={0}>
                <Grid className={classes.questionText} item={true} align="left" xs={12} lg={12} sm={12}>
                    <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: enunciado}} />
                </Grid>
                <Grid className={classes.answer} container={true} spacing={2}>
                    { returnAnswerOption() }
                </Grid>
            </Grid>
        </MyCardContent>
    );
}
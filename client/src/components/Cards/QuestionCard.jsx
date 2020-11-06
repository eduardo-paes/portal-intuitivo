import React, { useEffect } from "react";

import { Grid, TextField } from "@material-ui/core";
import { MyCardContent } from "../../assets/styles/styledComponents"
import { RadioAnswer, WirisIframe } from "../";

import { useStyles } from '../../assets/styles/classes';
import "./QuestionStyles.css"

import api from "../../api";

export default function QuestionCard (props) {
    const classes = useStyles();
    const { idQuestion, answered, enunciado, tipoResposta, gabarito, resposta, respostaQuestao, setRespostaQuestao, respostaQuestaoIDs, setRespostaQuestaoIDs, atividadeID, revisaoID, alunoID, name, mobile, respostaMobile } = props;
    console.log("Não entra aqui?!")
    async function pegarResposta() {
        
        let response;
        
        if (atividadeID) {
            response = await api.encRespostaQuestaoPorAtividade(atividadeID, alunoID, idQuestion);
        } else {
            response = await api.encRespostaQuestaoPorRevisao(revisaoID, alunoID, idQuestion);
        }
        
        if (response.data.success === true) {
            setRespostaQuestao(response.data.data);
            if(!respostaQuestaoIDs.find(element => element === response.data.data._id)) {
                let array = respostaQuestaoIDs;
                array.push(response.data.data._id);
                setRespostaQuestaoIDs(array);
            }
        } else {
            await api.inserirRespostaQuestao({
                alunoID,
                atividadeID,
                revisaoID,
                questaoID: idQuestion,
                resposta: '',
                corrigido: false,
                nota: 0,
                comentario: ''
            }).then((res) => {
                setRespostaQuestao(res.data.data);

                if(!respostaQuestaoIDs.find(element => element === res.data.id)) {
                    let array = respostaQuestaoIDs;
                    array.push(res.data.id);
                    setRespostaQuestaoIDs(array);
                }
            });
        }
    }
    
    useEffect(() => {
        const abortController = new AbortController();
        console.log(idQuestion)
        pegarResposta();
        return abortController.abort();
        // eslint-disable-next-line
    }, [idQuestion]);

    function pegarRespostaDiscursiva(event) {
        const {value} = event.target; 
        setRespostaQuestao(prevValue => ({
            ...prevValue,
            resposta: value,
            nota: 0,
            corrigido: false
        }));
    }

    const returnAnswerOption = () => {
        if (name === 'redacao') {
            return null;
        }
        
        if (tipoResposta === "multiplaEscolha") {
            return (
                <Grid className={classes.questionGrid} item={true} align="left" xs={12} lg={12} sm={12}>
                    <RadioAnswer 
                        idQuestion={idQuestion}
                        answered={answered} 
                        gabarito={gabarito.gab._id} 
                        mobile={mobile}
                        respostaMobile={respostaMobile} 
                        resposta={resposta}
                        respostaQuestao={respostaQuestao}
                        setRespostaQuestao={setRespostaQuestao}
                    />
                </Grid>
            )
        }
        
        if (tipoResposta === "discursiva") {
            return (
                <Grid className={classes.questionGrid} item={true} align="center" xs={12} lg={12} sm={12}>
                    <TextField
                        className={classes.answerField}
                        id={respostaQuestao.questao ? respostaQuestao.questao : ''}
                        label={respostaQuestao.resposta ? null : "Resposta"}
                        disabled={answered}
                        multiline
                        value={
                            respostaQuestao.questaoID === idQuestion ?
                                respostaQuestao.resposta && !mobile ?
                                respostaQuestao.resposta : 
                                respostaQuestao.resposta && mobile ?
                                respostaMobile : null
                            : null    
                        }
                        onChange={pegarRespostaDiscursiva}
                    />
                </Grid>
            )
        }
    }

    return (
        <MyCardContent>
            <Grid container={true}>
                <Grid item={true} align="left" xs={12} lg={12} sm={12}>
                    <WirisIframe text={enunciado}/>
                </Grid>
                <Grid container={true}>
                    { returnAnswerOption() }
                </Grid>
            </Grid>
        </MyCardContent>
    );
}
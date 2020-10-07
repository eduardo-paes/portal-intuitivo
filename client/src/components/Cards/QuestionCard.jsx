import React, { useEffect, useState } from "react";

import { Grid, TextField } from "@material-ui/core";
import { MyCardContent } from "../../assets/styles/styledComponents"
import { RadioAnswer } from "../";

import { useStyles } from '../../assets/styles/classes';
import "./QuestionStyles.css"

import api from "../../api";

export default function QuestionCard (props) {
    const classes = useStyles();
    const { idQuestion, answered, enunciado, tipoResposta, gabarito, padraoResposta, resposta, respostaQuestao, setRespostaQuestao, respostaQuestaoIDs, setRespostaQuestaoIDs, atividadeID, revisaoID, alunoID, name } = props;
    const [value, setValue] = useState(0);
    const [color, setColor] = useState('default');

    // const [flag, setFlag] = useState(false);
    // const [res, setRes] = useState();

    async function limpar() {
        api.removerRespostaQuestao("5f7cddd8b66d292960c2028b");
        api.removerRespostaQuestao("5f7cde00b66d292960c2028c");
        api.removerRespostaQuestao("5f7cde30b66d292960c2028e");
        api.removerRespostaQuestao("5f7cde37b66d292960c20290");
        api.removerRespostaQuestao("5f7cde58b66d292960c20291");
        api.removerRespostaQuestao("5f7cdea1b66d292960c20292");
        // api.removerRespostaQuestao("5f7cdc9189242c217269ac44");
        // api.removerRespostaQuestao("5f7cdcc7b66d292960c20287");
        // api.removerRespostaQuestao("5f7cdccab66d292960c20289");
    }
    
    async function pegarResposta() {
        
        let response;

        
        if (atividadeID) {
            response = await api.encRespostaQuestaoPorAtividade(atividadeID, alunoID, idQuestion);
        } else {
            response = await api.encRespostaQuestaoPorRevisao(revisaoID, alunoID, idQuestion);
        }
        
        if (response.data.success === true) {
            console.log(response.data.data._id)
            setRespostaQuestao(response.data.data);
        } else {
            await api.inserirRespostaQuestao({
                alunoID,
                atividadeID,
                revisaoID,
                questaoID: idQuestion,
                resposta: ''
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
        pegarResposta();
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
                <Grid className={classes.questionGrid} item={true} align="left" xs={12} lg={12} sm={12}>
                    <RadioAnswer 
                        idQuestion={idQuestion}
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
                <Grid className={classes.questionGrid} item={true} align="center" xs={12} lg={12} sm={12}>
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
            <Grid container={true}>
                <Grid item={true} align="left" xs={12} lg={12} sm={12}>
                    <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: enunciado}} />
                </Grid>
                <Grid container={true}>
                    { returnAnswerOption() }
                </Grid>
            </Grid>
        </MyCardContent>
    );
}
import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import "./QuestionStyles.css"

// -- Components
import { TextEditor } from "../";
import { MyCard, MyCardContent } from "../../assets/styles/styledComponents"

// -- Local Styles
const useStyles = makeStyles((theme) => ({
    cardQuestion: {
        maxWidth: "500px"
    }
}));

export default function QuestionCard (props) {
    const classes = useStyles();
    const {enunciado, tipoResposta, resposta} = props;

    return (
            <MyCardContent>
                <TextEditor 
                    id="mostrarEnunciadoQuestao"
                    text={enunciado}
                    readOnly={true}
                />
                { 
                    (tipoResposta === "multiplaEscolha") 
                        && resposta.map((item, index) => {
                            return (
                                <div key={index} className="optionSection">
                                    <TextEditor 
                                        id="mostrarOpcoesQuestao"
                                        text={item.opcao}
                                        readOnly={true}
                                    />
                                </div>
                            );
                        })
                }
            </MyCardContent>
    );
}
import React from "react";

import "./QuestionStyles.css"

// -- Components
import { TextEditor } from "../";
import { MyCardContent } from "../../assets/styles/styledComponents"
import RadioAnswer from "../Radio/RadioAnswer";
import { TextareaAutosize } from "@material-ui/core";

export default function QuestionCard (props) {

    const { enunciado, tipoResposta, padraoResposta, resposta } = props;

    return (
        <MyCardContent>
            <TextEditor 
                id="mostrarEnunciadoQuestao"
                text={enunciado}
                readOnly={true}
            />
            { 
                (tipoResposta === "multiplaEscolha") ? 
                <RadioAnswer resposta={resposta}/>
                : (tipoResposta === "discursiva") ?
                <TextareaAutosize/>
                : null
            }
        </MyCardContent>
    );
}
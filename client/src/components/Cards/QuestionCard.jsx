import React from "react";

import "./QuestionStyles.css"

// -- Components
import { TextEditor } from "../";
import { MyCardContent } from "../../assets/styles/styledComponents"

export default function QuestionCard (props) {
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
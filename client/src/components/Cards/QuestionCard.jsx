import React from "react";

import "./QuestionStyles.css"
// -- Components
import { MyCardContent } from "../../assets/styles/styledComponents"
import RadioAnswer from "../Radio/RadioAnswer";
import { Button, TextareaAutosize } from "@material-ui/core";

export default function QuestionCard (props) {

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
            <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: enunciado}} />
            { 
                (tipoResposta === "multiplaEscolha") ? 
                <RadioAnswer value={value} setValue={setValue} answered={answered} gabarito={gabarito._id} color={color} resposta={resposta}/>
                : (tipoResposta === "discursiva") ?
                <TextareaAutosize/>
                : null
            }
            <Button autoFocus variant='contained' color="primary" onClick={handleSubmit}>
              Responder
            </Button>
        </MyCardContent>
    );
}
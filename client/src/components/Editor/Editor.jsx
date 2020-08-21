import React, { useState } from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import {uploadAdapterPlugin} from "./UploadEditor";
import "./styles.css"

// -- Configuração da toolbar para uso na edição das respostas da questão
const editorConfig = {
    toolbar: {
		items: [
			'bold',
			'italic',
			'subscript',
			'superscript',
			'|',
			'MathType',
			'specialCharacters',
			'undo',
			'redo'
		]
    },
    removePlugins: [ 
        'List'
    ],
}

// -- Função Principal
function TextEditor (props) {
    const {text, setText, optionType, position} = props;                // Dados passados ao editor
    const [defaultMessage, setDefaultMessage] = useState("Edite aqui")  // Mensagem inicial do editor

    // -- Função para determinar mensagem inicial do editor
    const handleDefaultMessage = () => {
        if (optionType) {
            if (text !== '') {
                setDefaultMessage(text);
            } else {
                setDefaultMessage(`<p><span style='color:hsl(0, 0%, 30%)'>Opção ${position+1}</span></p>`);
            }
        } else {
            if (text.enunciado !== '') {
                setDefaultMessage(text.enunciado);
            } else {
                setDefaultMessage("<p><span style='color:hsl(0, 0%, 30%)'>Digite o enunciado aqui</span></p>");
            }
        }
        return defaultMessage;
    }
    
    // -- Função para guardar as modificações realizadas no campo de texto do editor
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        // Verifica qual o modo de inserção apropriado (opção ou enunciado)
        optionType ? setText(position, data) : setText(data);
    }
    
    // -- Função acionada quando editor entra em foco
    const onEditorFocus = () => {
        optionType ? setDefaultMessage(text) : setDefaultMessage(text.enunciado);
    }

    return (
        <div>
            <CKEditor
                    editor={ Editor }
                    name="ckeditor"
                    data={ defaultMessage }
                    onInit={ editor => { 
                        editor.ui.focusTracker.on('change:isFocused', (evt, name, value) => {value && onEditorFocus()});
                        uploadAdapterPlugin(editor);
                        handleDefaultMessage() 
                    }}
                    config={ optionType && editorConfig }
                    onError={ err => console.log(err) }
                    onChange={ handleEditorChange }
                />
        </div>
    )
}

export default TextEditor;
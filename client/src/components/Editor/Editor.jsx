import React, {useEffect} from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import {uploadAdapterPlugin} from "./UploadEditor";
import "./styles.css"
import { useState } from "react";

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
            'imageUpload',
			'undo',
			'redo'
		]
    },
    removePlugins: [ 
        'List'
    ],
}

const generalConfig = {}

// -- Função Principal
function TextEditor (props) {
    const {text, setText, optionType, position} = props;                        // Dados passados ao editor
    const [defaultMessage, setDefaultMessage] = useState('');

    useEffect(() => {
        optionType ? setText(position, text) : setText(text);
    // eslint-disable-next-line    
    }, [text])

    // -- Função para determinar mensagem inicial do editor
    const handleDefaultMessage = () => {
        // Opções de Resposta
        if (optionType) {
            setDefaultMessage(`<p><span style='color:hsl(0, 0%, 30%)'>Opção de resposta</span></p>`);
        } 
        // Enunciado da Questão
        else {
            setDefaultMessage("<p><span style='color:hsl(0, 0%, 30%)'>Digite o enunciado aqui</span></p>");
        }
    }
    
    // -- Função acionada quando editor entra em foco
    const onEditorFocus = (isFocused) => {
        // Mensagem do editor se adapta caso haja valores em text
        setDefaultMessage(text);
    }

    // -- Função para guardar as modificações realizadas no campo de texto do editor
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        // Verifica qual o modo de inserção apropriado (opção ou enunciado)
        optionType ? setText(position, data) : setText(data);
    }
    
    return (
        <div>
            <CKEditor
                    editor={ Editor }
                    name="ckeditor"
                    data={ text === '' ? defaultMessage : text }
                    onInit={ editor => { 
                        editor.ui.focusTracker.on('change:isFocused', (evt, name, value) => {value && onEditorFocus()});
                        uploadAdapterPlugin(editor);
                        handleDefaultMessage() 
                    }}
                    config={ optionType ? editorConfig : generalConfig }
                    onError={ err => console.log(err) }
                    onChange={ handleEditorChange }
                />
        </div>
    )
}

export default TextEditor;
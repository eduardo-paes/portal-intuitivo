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
            'ChemType',
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

// -- Função Principal
function TextEditor (props) {
    const {text, setText, optionType, position, readOnly, initialMessage} = props;                        // Dados passados ao editor
    const [defaultMessage, setDefaultMessage] = useState(initialMessage);

    useEffect(() => {
        if (!readOnly) {
            optionType ? setText(position, text) : setText(text);
        }
    // eslint-disable-next-line    
    }, [text])
   
    // -- Função acionada quando editor entra em foco
    const onEditorFocus = (isFocused) => {
        // Mensagem do editor se adapta caso haja valores em text
        setDefaultMessage(text);
    }

    // -- Função para guardar as modificações realizadas no campo de texto do editor
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        // Verifica qual o modo de inserção apropriado (opção ou enunciado)
        if (!readOnly) {
            optionType ? setText(position, data) : setText(data);
        }
    }

    return (
        <CKEditor
                editor={ Editor }
                name="ckeditor"
                data={ text === '' ? defaultMessage : text }
                onInit={ editor => { 
                    editor.ui.focusTracker.on('change:isFocused', (evt, name, value) => {value && onEditorFocus()});
                    editor.isReadOnly = readOnly;
                    uploadAdapterPlugin(editor);
                }}
                config={ optionType && editorConfig }
                onError={ err => console.log(err) }
                onChange={ handleEditorChange }
            />
    )
} 

export default TextEditor;
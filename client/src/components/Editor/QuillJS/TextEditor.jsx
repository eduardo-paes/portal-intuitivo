import React, {useState} from 'react';
import QuillEditor from "./QuillEditor"

// Function Main
function TextEditor(props) {
    // -- Define principais constantes
    const [text, setText] = useState("")
    const [conteudoFiles, setFiles] = useState([])


    // -- Definição das Funções
    const onEditorChange = (value) => {
        setText(value);
        console.log(text);
    }

    const onFilesChange = (files) => {
        setFiles(files);
        console.log(conteudoFiles);
    }

    return (
        <div>
            <QuillEditor
                placeholder={"Digite aqui"}
                onEditorChange={onEditorChange}
                onFilesChange={onFilesChange}/>
        </div>
    );
}

export default TextEditor;

import React, {useState} from 'react';
import QuillEditor from "./QuillEditor"

// Function Main
function TextEditor(props) {
    // -- Define principais constantes
    const {setAtividade} = props;
    const [conteudoFiles, setFiles] = useState([])

    // -- Definição das Funções
    const onEditorChange = (value) => {
        setAtividade(preValue => ({
            ...preValue,
            conteudo: value
        }));
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

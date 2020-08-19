import React from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import {uploadAdapterPlugin} from "./UploadEditor";

function TextEditor (props) {
    const {text, setText} = props;
    
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setText(preValue => ({
            ...preValue,
            enunciado: data
        }));
    }

    return (
        <div>
            <p>{text.enunciado}</p>
            <CKEditor
                    editor={ Editor }
                    name="ckeditor"
                    data="<p><span style='color:hsl(0, 0%, 30%)'>Digite o enunciado aqui.</span></p>"
                    onInit={editor => {
                        editor.ui.view.editable.element.style.height = "200px"
                        uploadAdapterPlugin(editor)
                    }}
                    // config={ { ckfinder: {uploadUrl: "http://localhost:5000/api/upload-arquivo"} } }
                    onError={ err => console.log(err) }
                    onChange={ handleEditorChange }
                    style={{color: "#fff"}}
                />
        </div>
    )
}

export default TextEditor;
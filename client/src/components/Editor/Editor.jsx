import React from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import axios from 'axios';
const postURL = "http://localhost:3000/api//upload-arquivo";

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
                    editor={ ClassicEditor }
                    data="<p>Digite o enunciado aqui.</p>"
                    onInit={ editor => {
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    config={
                        {
                            ckfinder: {
                                uploadUrl: postURL
                            }
                        }
                    }
                    onChange={handleEditorChange}
                />
        </div>
    )
}

export default TextEditor;
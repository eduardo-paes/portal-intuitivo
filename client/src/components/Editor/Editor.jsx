import React from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editorConfig = {
    ckfinder: {uploadUrl: "http://localhost:3000/api/uploads"}
};

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
                    onInit={ editor => {console.log( 'Editor is ready to use!', editor )} }
                    config={ editorConfig }
                    onError={ err => console.log(err) }
                    onChange={ handleEditorChange}
                />
        </div>
    )
}

export default TextEditor;
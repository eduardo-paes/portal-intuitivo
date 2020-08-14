import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { useState } from "react";

const modules = {
    toolbar: [
       [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ]
}

const formats = [
    'font',
    'size',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'align',
    'color', 'background'
]

function TextEditor (props) {
    const [text, setText] = useState("")

    function handleChange(content, delta, source, editor) {
        // console.log(editor.getHTML());       // HTML/rich text
        // console.log(editor.getText());       // plain text
        // console.log(editor.getLength());     // number of characters
        setText(editor.getText());
    }

    return (
        <div>
            <ReactQuill 
                theme="snow"
                style={{background: "#fff"}}
                modules={modules}
                formats={formats}
                value={text}
                onChange={handleChange}
                placeholder="Digite o enunciado da questão aqui."
            />
        </div>
    )
}

export default TextEditor;
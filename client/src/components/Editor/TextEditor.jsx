import React, {useState, useEffect} from 'react';
// import axios from "axios";
// import {useSelector} from "react-redux";
import QuillEditor from "./QuillEditor"

// Material-UI
import {Button} from '@material-ui/core';
import {MyTextField} from "../../styles/styledComponents"

function initialState() {
    return {
        disciplina: "",
        topico: "",
        semana: "",
        data: "",
        conteudo: ""
    } 
}

// -- Main Function
function TextEditor() {
    // const user = useSelector(state => state.user);

    const [files, setFiles] = useState([])
    const [material, setMaterial] = useState(initialState);

    const onEditorChange = (value) => {
        setMaterial(preValue => ({
            ...preValue,
            conteudo: value
        }));
    }

    const onFilesChange = (files) => {
        setFiles(files);
        console.log(files);
    }

    const onMaterialChange = (event) => {
        const {name, value} = event.target;
        setMaterial(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    function saveContent(event) {
        event.preventDefault();
                
        console.log("VAR:", material);

        // setMaterial(initialState);
    }

    return (
        <div>
            <MyTextField
                id="outlined-basic"
                label="Tópico"
                variant="outlined"
                name="topico"
                type="text"
                value={material.topico}
                onChange={onMaterialChange}/>

            <QuillEditor 
                placeholder={"Digite aqui"}
                onEditorChange={onEditorChange}
                onFilesChange={onFilesChange}
            />
            <form onSubmit={saveContent}>
                <div style={{ textAlign: "center", margin: "2rem" }}>
                    <Button 
                        variant="outlined" 
                        type="submit"
                        color="primary" 
                        onSubmit={saveContent}>
                        Salvar
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default TextEditor;

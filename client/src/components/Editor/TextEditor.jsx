import React, {useState, useEffect} from 'react';
import QuillEditor from "./QuillEditor"
import api from '../../api'

// Material-UI
import {Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    buttons: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(1)
    }
}));

function initialState() {
    return {
        disciplina: "",
        topico: "",
        semana: "",
        data: "",
        conteudo: "",
        autor: ""
    }
}

// Function Main
function TextEditor() {
    // -- Acesso a API - Retorna usuário do banco de dados
    useEffect(() => {
        async function fetchMyAPI() {
            await api
        }
        fetchMyAPI()
    }, []);
    
    // -- Define principais constantes
    const classes = useStyles();
    const [materialFiles, setFiles] = useState([])
    const [material, setMaterial] = useState(initialState);

    // -- Definição das Funções
    const onEditorChange = (value) => {
        setMaterial(preValue => ({
            ...preValue,
            conteudo: value
        }));
    }

    const onFilesChange = (files) => {
        setFiles(files);
        console.log(materialFiles);
    }

    // const onMaterialChange = (event) => {
    //     const {name, value} = event.target;
    //     setMaterial(preValue => ({
    //         ...preValue,
    //         [name]: value
    //     }));
    // }

    const cleanContent = (event) => {
        event.preventDefault();
        setFiles([]);
        setMaterial(initialState);
    }

    const saveContent = (event) => {
        event.preventDefault();

        // console.log("VAR:", material);
        if (material) {
            api
                .inserirConteudo(material)
                .then(res => {
                    window.alert("Conteúdo inserido com sucesso.")
                })
        }
    }

    return (
        <div>
            <QuillEditor
                placeholder={"Digite aqui"}
                onEditorChange={onEditorChange}
                onFilesChange={onFilesChange}/>

                <div className="group-buttons">
                    <Button className={classes.buttons} variant="outlined" type="submit" color="secondary" onClick={cleanContent}>
                        Limpar
                    </Button>

                    <Button className={classes.buttons} variant="outlined" type="submit" color="primary" onClick={saveContent}>
                        Salvar
                    </Button>
                </div>
        </div>
    );
}

export default TextEditor;

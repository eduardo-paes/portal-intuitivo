import React, { useState, useEffect } from "react";
import api from '../../api';
import { MyContainer, MyTextField, GeneralTitle } from "../../assets/styles/styledComponents";
import { Grid, MenuItem } from "@material-ui/core";
import UploadContent from "../Upload/UploadContent";

export default function ContentForm (props) {
    const { material, setMaterial, conteudo, setConteudo, onSubmit } = props;
    const [listaDisciplina, setListaDisciplina] = useState([]);                      // Disciplinas do Banco de Dados

    // -- Carrega as Disciplinas existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchDisciplinaAPI() {
            const response = await api.listarDisciplinas();
            const value = response.data.data;
            setListaDisciplina(value);
        }
        fetchDisciplinaAPI()
        return abortController.abort();
    }, []);

    // -- Definição das Funções
    const handleChange = (event) => {
        const {name, value} = event.target;
        setMaterial(preValue => ({
            ...preValue,
            [name]: value
        }));
    }
        
    const handleUpload = async event => {
        const file = event.target.files[0];
        setMaterial(preValue => ({
        ...preValue,
        conteudo: file
        }));
        setConteudo(URL.createObjectURL(file));
    }

    const handleSubject = (disciplina, area) => {
        setMaterial(preValue => ({
            ...preValue,
            disciplinaID: disciplina,
            area: area
        }));
    }

    const array = [];
    for (let i = 1; i < 33; ++i) array[i-1] = i;

    return (
        <MyContainer>
            <GeneralTitle>Criar Conteúdo</GeneralTitle>

            <Grid container spacing={1}>
                <Grid item={true} xs={12} sm={4}>
                    <MyTextField
                        id="campoArea"
                        variant="outlined"
                        disabled={true}
                        label="Área do Conhecimento"
                        name="area"
                        value={material.area ? material.area : ""} />
                </Grid>
                <Grid item={true} xs={12} sm={4}>
                    <MyTextField
                        id="campoDisciplina"
                        variant="outlined"
                        select={true}
                        label="Disciplina"
                        name="disciplinaID"
                        value={material.disciplinaID ? material.disciplinaID : ""}>
                        {
                            listaDisciplina.map((row, index) => {
                                return <MenuItem key={index} value={row._id} onClick={() => handleSubject(row._id, row.areaConhecimento)}>{row.nome}</MenuItem>
                            })
                        }
                    </MyTextField>
                </Grid>
                <Grid item={true} xs={12} sm={4}>
                    <MyTextField
                        id="campoNumeracao"
                        label="Numeração"
                        variant="outlined"
                        name="numeracao"
                        type="text"
                        select={true}
                        value={material.numeracao}
                        onChange={handleChange}>
                            {
                                array.map((row, index) => {
                                    return <MenuItem key={index} value={row}>{row}</MenuItem>
                                })
                            }
                    </MyTextField>
                </Grid>
                <Grid item={true} xs={12}>
                    <MyTextField
                        id="campoTopico"
                        label="Tópico"
                        variant="outlined"
                        name="topico"
                        type="text"
                        value={material.topico}
                        onChange={handleChange}/>
                </Grid>
            </Grid>
            
            <UploadContent 
                onChange={handleUpload}
                topico={material.topico} 
                conteudo={conteudo} 
                backTo="/controle-conteudo" 
                onSubmit={onSubmit}
            />
        </MyContainer>
    );
}
import React, { useState, useEffect } from "react";
import api from '../../api';
import { MyContainer, MyTextField, GeneralTitle } from "../../assets/styles/styledComponents";
import { makeStyles, Grid, MenuItem } from "@material-ui/core";
import UploadContent from "../Upload/UploadContent";

// -- Local Styles
const useStyles = makeStyles((theme) => ({
    errorMessage: {
        fontSize: "0.75rem",
        paddingLeft: "1rem",
        color: "#f44336"
    }
}));

export default function ContentForm (props) {
    const { material, setMaterial, conteudo, setConteudo, onSubmit } = props;
    const [listaDisciplina, setListaDisciplina] = useState([]);                      // Disciplinas do Banco de Dados
    const classes = useStyles();

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
                        value={material.area ? material.area : ""}
                        error={material.erros.area ? true : false}/>
                        {material.erros.area && <p className={classes.errorMessage}>{material.erros.area}</p>}
                </Grid>

                <Grid item={true} xs={12} sm={4}>
                    <MyTextField
                        id="campoDisciplina"
                        variant="outlined"
                        select={true}
                        label="Disciplina"
                        name="disciplinaID"
                        value={material.disciplinaID ? material.disciplinaID : ""}
                        error={material.erros.disciplina ? true : false}>
                        {
                            listaDisciplina.map((row, index) => {
                                return <MenuItem key={index} value={row._id} onClick={() => handleSubject(row._id, row.areaConhecimento)}>{row.nome}</MenuItem>
                            })
                        }
                    </MyTextField>
                    {material.erros.disciplina && <p className={classes.errorMessage}>{material.erros.disciplina}</p>}
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
                        onChange={handleChange}
                        error={material.erros.numeracao ? true : false}>
                            {
                                array.map((row, index) => {
                                    return <MenuItem key={index} value={row}>{row}</MenuItem>
                                })
                            }
                    </MyTextField>
                    {material.erros.numeracao && <p className={classes.errorMessage}>{material.erros.numeracao}</p>}
                </Grid>

                <Grid item={true} xs={12}>
                    <MyTextField
                        id="campoTopico"
                        label="Link da Videoaula"
                        variant="outlined"
                        name="videoAulaURL"
                        type="text"
                        value={material.videoAulaURL ? material.videoAulaURL : ""}
                        onChange={handleChange}
                        error={material.erros.videoAulaURL ? true : false}/>
                        {material.erros.videoAulaURL && <p className={classes.errorMessage}>{material.erros.videoAulaURL}</p>}
                </Grid>

                <Grid item={true} xs={12}>
                    <MyTextField
                        id="campoTopico"
                        label="Tópico"
                        variant="outlined"
                        name="topico"
                        type="text"
                        value={material.topico}
                        onChange={handleChange}
                        error={material.erros.topico ? true : false}/>
                        {material.erros.topico && <p className={classes.errorMessage}>{material.erros.topico}</p>}
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
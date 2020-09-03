import React from "react";
import { MyContainer, MyTextField } from "../../assets/styles/styledComponents";
import { Grid, MenuItem } from "@material-ui/core";
import UploadContent from "../Upload/UploadContent";

function ContentForm (props) {
    const { data, onMaterialChange, conteudo, listaDisciplina, handleUpload, onSubmit, onDisciplineChange } = props;
    const { area, disciplina, numeracao, topico } = data;

    const array = [];
    for (let i = 1; i < 33; ++i) array[i-1] = i;

    return (
        <MyContainer>
            <h1 className="heading-page">Criar Conteúdo</h1>
            <Grid container spacing={1}>
            <Grid item={true} xs={12} sm={4}>
                <MyTextField
                id="campoArea"
                variant="outlined"
                disabled={false}
                select={true}
                label="Área do Conhecimento"
                name="area"
                value={area ? area : ""}
                onChange={onMaterialChange}>
                    <MenuItem value="Ciências Humanas">Ciências Humanas</MenuItem>
                    <MenuItem value="Ciências da Natureza">Ciências da Natureza</MenuItem>
                    <MenuItem value="Linguagens">Linguagens</MenuItem>
                    <MenuItem value="Matemática">Matemática</MenuItem>
                </MyTextField>
            </Grid>
            <Grid item={true} xs={12} sm={4}>
                <MyTextField
                    id="campoDisciplina"
                    variant="outlined"
                    select={true}
                    label="Disciplina"
                    name="disciplinaID"
                    autoFocus={true}
                    value={disciplina.nome}>
                    {
                        listaDisciplina.map((row, index) => {
                            return <MenuItem key={index} value={row.nome} onClick={() => onDisciplineChange("disciplina", row._id, row.nome)}>{row.nome}</MenuItem>
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
                    value={numeracao}
                    onChange={onMaterialChange}>
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
                    value={topico}
                    onChange={onMaterialChange}/>
            </Grid>
            </Grid>
            <UploadContent 
                onChange={handleUpload}
                topico={topico} 
                conteudo={conteudo} 
                backTo="/controle-conteudo" 
                onSubmit={onSubmit}
            />
        </MyContainer>
    );
}

export default ContentForm;
import React, {useContext, useState, useEffect} from "react";
import api from '../../api';


import {StoreContext} from "../../utils";
import { UploadContent } from "../../components";

import {MyContainer, MyTextField} from "../../assets/styles/styledComponents";
import {Grid, MenuItem} from '@material-ui/core';

function initialState() {
  return {
    area: "",
    disciplina: "", 
    topico: "",
    numeracao: 0,
    conteudo: {},
    autor: ""
  }
}

function Content(props) {
  const {token} = useContext(StoreContext);
  const autorInfo = token.userName;

  //console.log(autor);
  
  // -- Define principais constantes
  const [material, setMaterial] = useState(initialState);
  const [disciplina, setDisciplina] = useState([]);           // Disciplinas do Banco de Dados
  const [conteudo, setConteudo] = useState("");

  // -- Carrega as Disciplinas existentes no banco
  useEffect(() => {
      const abortController = new AbortController();
      async function fetchDisciplinaAPI() {
          const response = await api.listarDisciplinas();
          const value = response.data.data;
          setDisciplina(value);
      }
      fetchDisciplinaAPI()
      return abortController.abort();
  }, [disciplina]);

  // -- Definição das Funções

  const onMaterialChange = (event) => {
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

  const onSubmit = async event => {
    const {area, disciplina, topico, numeracao, conteudo} = material;

    const novoConteudo = {
      area,
      autor: autorInfo,
      disciplina, 
      topico, 
      numeracao,
      conteudo
    };

    console.log(novoConteudo);


    if (material.conteudo) {
      
      const formData = new FormData();
      formData.append("conteudo", material.conteudo);
      fetch('http://localhost:3000/api/controle-conteudo', {
              method: 'POST',
              body: formData
          })
          .then(res => res.json())
    }

    // Guarda novo usuário no banco
    await api
        .inserirConteudo(novoConteudo)
        .then(res => {
            window.alert("Conteúdo inserido com sucesso.")
            // Limpa os campos
            setMaterial({area: "", disciplina: "", topico: "", numeracao: 0,  conteudo: {}, autor: {}})
        })
  }


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
              value={material.area ? material.area : ""}
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
              name="disciplina"
              value={material.disciplina}
              onChange={onMaterialChange}>
              {
                  disciplina.map((row, index) => {
                      return <MenuItem key={index} value={row.nome}>{row.nome}</MenuItem>
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
                value={material.numeracao}
                onChange={onMaterialChange}/>
          </Grid>
          <Grid item={true} xs={12}>
              <MyTextField
                  id="campoTopico"
                  label="Tópico"
                  variant="outlined"
                  name="topico"
                  type="text"
                  value={material.topico}
                  onChange={onMaterialChange}/>
          </Grid>
      </Grid>
      <UploadContent onChange={handleUpload} conteudo={conteudo} backTo="/controle-conteudo" onSubmit={onSubmit}/>
    </MyContainer>
  );

};  

export default Content;

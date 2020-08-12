import React, {useContext, useState} from "react";
// import {Link} from '../../../node_modules/react-router-dom';
import api from '../../api';
//import PDFViewer from 'pdf-viewer-reactjs';
//import { Document, Page, pdfjs } from "react-pdf";

import {StoreContext} from "../../utils";
import { UploadContent } from "../../components";

import {/*AddButton, DeleteButton,*/ MyContainer, MyTextField} from "../../assets/styles/styledComponents";
import {Grid} from '@material-ui/core';

function initialState() {
  return {
    disciplina: "", 
    topico: "", 
    semana: "",
    dataCriacao: new Date(),
    dataLiberacao: new Date(), 
    conteudo: {},
    autor: {}
  }
}

function Content(props) {
  const {token} = useContext(StoreContext);
  const autor = {
    id: token.userID,
    nome: token.userName
  }

  console.log(autor);
  
  // -- Define principais constantes
  const [material, setMaterial] = useState(initialState);

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
  }

  const onSubmit = async event => {
    const {disciplina, topico, dataLiberacao, /*dataCriacao,*/ semana, conteudo, autor} = initialState;

    const novoConteudo = {
      disciplina, 
      topico, 
      semana,
      data: dataLiberacao, 
      conteudo, 
      autor
    };

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
            setMaterial({disciplina: "", semana: "", topico: "", dataLiberacao: new Date(), dataCriacao: new Date(),  conteudo: {}, autor: {}})
        })
  }


  return (
      <MyContainer>
        <h1 className="heading-page">Criar Conteúdo</h1>
        <Grid container spacing={1}>
          <Grid item={true} xs={12} sm={4}>
            <MyTextField
                id="outlined-basic"
                label="Disciplina"
                variant="outlined"
                name="disciplina"
                type="text"
                value={material.disciplina}
                onChange={onMaterialChange}/>
          </Grid>
          <Grid item={true} xs={12} sm={4}>
            <MyTextField
                id="outlined-basic"
                label="Semana"
                variant="outlined"
                name="semana"
                type="text"
                value={material.semana}
                onChange={onMaterialChange}/>
          </Grid>
          <Grid item={true} xs={12} sm={4}>
            <MyTextField
                id="outlined-basic"
                label="Data"
                variant="outlined"
                name="dataLiberacao"
                type="text"
                value={material.dataCriacao.getDate() + "/" + (material.dataCriacao.getMonth()+1) + "/" + material.dataCriacao.getFullYear()}
                onChange={onMaterialChange}/>
          </Grid>
          <Grid item={true} xs={12}>
              <MyTextField
                  id="outlined-basic"
                  label="Tópico"
                  variant="outlined"
                  name="topico"
                  type="text"
                  value={material.topico}
                  onChange={onMaterialChange}/>
          </Grid>
      </Grid>
      <UploadContent onChange={handleUpload} backTo="/controle-usuario/list" onSubmit={onSubmit}/>
    </MyContainer>
  );

};  

export default Content;

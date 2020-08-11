import React, {useContext, useState} from "react";
import { Document, Page } from "react-pdf/dist/entry.webpack";

import {StoreContext} from "../../utils";
import { UploadContent } from "../../components";

import {MyContainer, MyTextField} from "../../assets/styles/styledComponents";
import {Grid} from '@material-ui/core';

function initialState() {
  return {
    disciplina: "", 
    topico: "", 
    semana: "",
    dataCriacao: new Date(),
    dataLiberacao: new Date(), 
    conteudo: {}, 
    autor: ""
  }
}

// -- Outro modelo de conteúdo 
// return {
//   disciplina: "",
//   topico: "",
//   semana: "",
//   conteudo: '',
//   dataCriacao: new Date(),
//   publicado: false,
//   dataModificacao: new Date(),
//   autor: '' 
// }


function Content(props) {
  const {token} = useContext(StoreContext);
  const autor = {
    id: token.userID,
    nome: token.userName
  }

  //console.log(autor);
  
  // -- Define principais constantes
  const [material, setMaterial] = useState(initialState);
  //console.log(material.dataLiberacao);

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
    console.log(material.conteudo);
    if (material.conteudo) {
      const formData = new FormData();
      formData.append("conteudo", material.conteudo);
      fetch('http://localhost:3000/api/controle-conteudo', {
              method: 'POST',
              body: formData
          })
          .then(res => res.json())
    }
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
      <UploadContent onChange={handleUpload}/>
      {material.conteudo ? <Document file={material.conteudo}/> : null}
      
    </MyContainer>
  );

};  

export default Content;

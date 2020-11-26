import Axios from "axios";
import React, { useState, useEffect } from "react";
import api from '../../api';
import ContentForm from "../../components/Form/ContentForm";
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateContent";

function initialState(props) {
  return {
    id: props.match.params.id,
    disciplinaID: "", 
    area: "",     // Campo temporário   
    topico: "",
    numeracao: "",
    videoAulaURL:  "",
    autor: "",
    conteudo: {
      file: {},
      url: ''
    },
    conteudoURL: "",
    erros: []
  }
}

export default function ContentUpdate(props) {  
  // -- Define principais constantes
  const [conteudo, setConteudo] = useState("");
  const [material, setMaterial] = useState(initialState(props));
  
  // -- Carrega Conteúdo do Banco
  useEffect( () => {
    const abortController = new AbortController();
    async function fetchConteudoAPI() {
      const response = await api.encConteudoPorID(material.id);
      const value = response.data.data;

      setMaterial(preValue => ({ 
        ...preValue,
        area: value.disciplinaID.areaConhecimento,
        disciplinaID: value.disciplinaID._id,
        numeracao: value.numeracao, 
        videoAulaURL: value.videoAulaURL, 
        topico: value.topico,
        autor: value.autor,
        conteudoURL: value.conteudoURL
      }));

      setConteudo({
        file: {},
        url: value.conteudoURL
      })
    }
    fetchConteudoAPI();
    return abortController.abort();
  // eslint-disable-next-line
  }, []);

  const onSubmit = async event => {
    const { autor, disciplinaID, topico, numeracao, videoAulaURL, conteudoURL } = material;
    const error = validate(material);

    setMaterial(preValue => ({
      ...preValue,
      erros: error
    }))

    if (error.validated) {
      var conteudoAtualizado = {
        autor,
        disciplinaID, 
        topico, 
        numeracao,
        videoAulaURL,
        conteudoURL
      };
      
      // Verifica se o usuário subiu algum conteúdo pdf
      if (conteudo.file !== {}) {
        // Salva o pdf na pasta local
        const formData = new FormData();
        formData.append("conteudo", material.conteudo);
        
        await Axios.post(`http://localhost:5000/api/upload-conteudo/${material.id}`, formData)
        .then(res => {
          conteudoAtualizado.conteudoURL = res.data.url
        })
        .catch(err => {
          console.log(err);
        });
      }

      // Guarda novo usuário no banco
      await api
        .atualizarConteudo(material.id, conteudoAtualizado)
        .then(res => {
          window.alert("Conteúdo atualizado com sucesso.");
        })
        .catch(err => {
          window.alert("Houve um erro com a atualização do conteúdo, verifique se todas as informações estão corretas. Se o erro persistir, informe à equipe técnica.");
        }); 
    }
  }
  
  return (
    <ContentForm 
      material={material}
      setMaterial={setMaterial}
      conteudo={conteudo}
      setConteudo={setConteudo}
      onSubmit={onSubmit}
    />
  );
};

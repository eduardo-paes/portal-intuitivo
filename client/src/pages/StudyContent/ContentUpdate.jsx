import React, { useState, useEffect } from "react";
import api from '../../api';
import ContentForm from "../../components/Form/ContentForm";
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateContent";

function initialState(props) {
  return {
    id: props.match.params.id,
    disciplina: "", 
    area: "",     // Campo temporário   
    topico: "",
    numeracao: '',
    autor: "",
    conteudo: {},
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
        area: value.area, 
        disciplinaID: value.disciplinaID,
        numeracao: value.numeracao, 
        topico: value.topico,
        autor: value.autor
      }));
      setConteudo(`http://localhost:5000/uploads/content/${material.id}.pdf`)
    }
    fetchConteudoAPI();
    return abortController.abort();
  // eslint-disable-next-line
  }, []);

  const onSubmit = async event => {
    const { autor, disciplinaID, topico, numeracao } = material;
    const error = validate(material);

    setMaterial(preValue => ({
      ...preValue,
      erros: error
    }))

    if (error.validated) {
      const conteudoAtualizado = {
        autor,
        disciplinaID, 
        topico, 
        numeracao
      };  
  
      // Guarda novo usuário no banco
      await api
        .atualizarConteudo(material.id, conteudoAtualizado)
        .then(res => {

        // Verifica se o usuário subiu algum conteúdo pdf
        if (conteudo) {
          // Salva o pdf na pasta local
          const formData = new FormData();
          formData.append("conteudo", material.conteudo);
          fetch(`http://localhost:5000/api/upload-conteudo/${res.data.id}`, {
                method: 'POST',
                body: formData
              })
            .then(res => res.json())
        }
            window.alert("Conteúdo atualizado com sucesso.")
        })
  
      if (conteudo) {
        const formData = new FormData();
        formData.append("conteudo", conteudo);
        fetch('http://localhost:5000/api/upload-conteudo', {
            method: 'POST',
            body: formData
          })
          .then(res => res.json())
      }  
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

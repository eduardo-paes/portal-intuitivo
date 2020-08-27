import React, {useContext, useState, useEffect} from "react";
import api from '../../api';

import {StoreContext} from "../../utils";
import ContentForm from "../../components/Form/ContentForm";
import validate from "../../components/Form/Validation/FormValidateContent";

function initialState(props) {
  return {
    id: props.match.params.id,
    area: "",
    disciplinaID: '',
    disciplinaNome: '',  
    topico: "",
    numeracao: 0,
    autor: [],
    conteudo: {},
    erros: []
  }
}

function Content(props) {
  
  const {token} = useContext(StoreContext);
  
  // -- Define principais constantes
  const [disciplina, setDisciplina] = useState([""]);           // Disciplinas do Banco de Dados
  const [conteudo, setConteudo] = useState("");
  const [material, setMaterial] = useState(initialState(props));
  
  useEffect( () => {
    const abortController = new AbortController();
    async function fetchConteudoAPI() {
      const response = await api.encConteudoPorID(material.id);
      setMaterial(preValue => ({ 
        ...preValue,
        area: response.data.data.area, 
        disciplinaID: response.data.data.disciplinaID, 
        disciplinaNome: response.data.data.disciplinaNome,
        numeracao: response.data.data.numeracao, 
        topico: response.data.data.topico
      }))
    }
    fetchConteudoAPI();
    return abortController.abort();

    
  // eslint-disable-next-line
  }, []);

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
  }, []);

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
    const {area, disciplinaID, topico, numeracao, conteudo, id, autor} = material;
    const error = validate(material);
    const response = await api.encDisciplinaPorID(disciplinaID);

    setMaterial(preValue => ({
      ...preValue,
      erros: error,
      autor: autor.push(token.userID)
    }))

    if(error.validated) {
      
      const conteudoAtualizado = {
        area,
        autor,
        disciplinaID, 
        disciplinaNome: response.data.data.nome, 
        topico, 
        numeracao
      };  
  
      // Guarda novo usuário no banco
      await api
          .atualizarConteudo(id, conteudoAtualizado)
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


              window.alert("Conteúdo inserido com sucesso.")
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
        data={material}
        listaDisciplina={disciplina}
        onSubmit={onSubmit}
        conteudo={conteudo}
        handleUpload={handleUpload}
        onMaterialChange={onMaterialChange}
      />
  );

};  

export default Content;

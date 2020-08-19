import React, {useContext, useState, useEffect} from "react";
import api from '../../api';


import {StoreContext} from "../../utils";
import ContentForm from "../../components/Form/ContentForm";

function initialState() {
  return {
    area: "",
    disciplina: '', 
    topico: "",
    numeracao: 0,
    autor: "",
    conteudo: {}
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
      numeracao
    };

    console.log(novoConteudo);


    if (conteudo) {
      
      const formData = new FormData();
      formData.append("conteudo", conteudo);
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

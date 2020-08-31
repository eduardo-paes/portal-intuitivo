import React, {useContext, useState, useEffect} from "react";
import api from '../../api';


import {StoreContext} from "../../utils";
import ContentForm from "../../components/Form/ContentForm";
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateContent";

function initialState() {
  return {
    area: "",
    disciplina: {
      id: '', 
      nome: ''
    },    
    topico: "",
    numeracao: 0,
    autor: [],
    conteudo: {},
    erros: []
  }
}

function Content(props) {
  const {token} = useContext(StoreContext);

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

  function onDisciplineChange (nameField, ID, nome) {
    setMaterial(preValue => ({
      ...preValue,
      [nameField]: {
        id: ID,
        nome: nome
      }
    }));
  }

  const onSubmit = async event => {
    const {area, disciplina, topico, numeracao, autor} = material;
    const error = validate(material);
    const response = await api.encDisciplinaPorID(disciplina.id);
    disciplina.nome = response.data.data.nome;

    setMaterial(preValue => ({
      ...preValue,
      erros: error,
      autor: token.userID
    }))

    if(error.validated) {
      
      const novoConteudo = {
        area,
        autor,
        disciplina,
        topico, 
        numeracao
      };
  
      console.log(novoConteudo);
  
      // Guarda novo usuário no banco
      await api
      .inserirConteudo(novoConteudo)
      .then(res => {
        window.alert("Conteúdo inserido com sucesso.")

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

        // Limpa os campos
        setMaterial({area: "", disciplina: { id: "", nome: "" }, topico: "", numeracao: 0,  conteudo: {}, autor: {}})
        setConteudo("");
      })
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
        onDisciplineChange={onDisciplineChange}

      />
  );

};  

export default Content;

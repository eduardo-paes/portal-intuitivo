import React, { useContext, useState } from "react";
import api from '../../api';
import { StoreContext } from "../../utils";
import ContentForm from "../../components/Form/ContentForm";
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateContent";

const initialState = {
  disciplinaID: "", 
  area: "",     // Campo temporário   
  topico: "",
  numeracao: '',
  autor: "",
  videoAulaURL: '',
  conteudo: {},
  erros: []
}

export default function ContentInsert(props) {
  const {token} = useContext(StoreContext);
  
  // -- Define principais constantes
  const [material, setMaterial] = useState(initialState);
  const [conteudo, setConteudo] = useState("");

  const onSubmit = async event => {
    const { disciplinaID, topico, numeracao, videoAulaURL } = material;
    const error = validate(material);

    setMaterial(preValue => ({
      ...preValue,
      erros: error
    }))

    if (error.validated) {
      const novoConteudo = {
        autor: token.userID,
        disciplinaID,
        topico, 
        numeracao,
        videoAulaURL
      };
  
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
          setMaterial(initialState)
          setConteudo("");
        })
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
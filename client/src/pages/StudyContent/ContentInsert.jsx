import React, { useContext, useState } from "react";
import api from '../../api';
import { StoreContext } from "../../utils";
import ContentForm from "../../components/Form/ContentForm";
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateContent";
import Axios from "axios";

const initialState = {
  disciplinaID: "", 
  area: "",     // Campo temporário   
  topico: "",
  numeracao: '',
  autor: "",
  videoAulaURL: '',
  conteudo: {
    file: {},
    url: ''
  },
  conteudoURL: '',
  erros: []
}

export default function ContentInsert(props) {
  const {token} = useContext(StoreContext);
  
  // -- Define principais constantes
  const [material, setMaterial] = useState(initialState);
  const [conteudo, setConteudo] = useState(initialState.conteudo);

  const onSubmit = async event => {
    const { disciplinaID, topico, numeracao, videoAulaURL, conteudoURL } = material;
    const error = validate(material);

    setMaterial(preValue => ({
      ...preValue,
      erros: error
    }))

    if (error.validated) {
      var novoConteudo = {
        autor: token.userID,
        disciplinaID,
        topico, 
        numeracao,
        videoAulaURL,
        conteudoURL
      };

      // Guarda novo conteúdo no banco
      await api
        .inserirConteudo(novoConteudo)
        .then(async res => {

          // Verifica se o usuário subiu algum conteúdo pdf
          if (conteudo.file !== {}) {

            // Salva o pdf na núvem
            const formData = new FormData();
            formData.append("conteudo", material.conteudo);
            
            await Axios.post(`http://localhost:5000/api/upload-conteudo/${res.data.id}`, formData)
              .then(res => novoConteudo.conteudoURL = res.data.url)
              .catch(err => {
                console.log(err);
              });
          }

          await api
            .atualizarConteudo(res.data.id, novoConteudo)
            .then(res => {
              window.alert("Conteúdo atualizado com sucesso.");
            })
            .catch(err => {
              window.alert("Houve um erro com a atualização do conteúdo, verifique se todas as informações estão corretas. Se o erro persistir, informe à equipe técnica.");
            });

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
import React from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { GreenButton } from '../../assets/styles/styledComponents'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
}));

const messages = [
  {
    title: 'Ops! Houve um erro ao enviar sua redação.',
    message: 'Verifique se o arquivo que nos enviou não está corrompido ou se possui um dos seguintes formatos permitidos: .jpg, .png, .jpeg.'
  },
  {
    title: 'Redação enviada!',
    message: 'Aí sim! Agora é só aguardar a correção de nossos professores. Em breve você estará recebendo sua correção!'
  },
  {
    title: 'Houve um erro ao enviar sua correção',
    message: 'Verifique se o arquivo que enviou não está corrompido ou se possui um dos seguintes formatos permitidos: .jpg, .png, .jpeg.'
  },
  {
    title: 'Correção enviada',
    message: 'Sua correção foi enviada com sucesso e já está disponível para o aluno'
  }
]

export default function UploadEssay(props) {
  const classes = useStyles();
  const { uploadLink, checked, primaryTitle, secondaryTitle, correction } = props;
  const { setFeedMsg, setFeedOpen, setCheck, progresso, setProgresso, setWasChecked, setEssayUploaded } = props;

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (file && uploadLink) {
      const formData = new FormData();
      formData.append("foto", file);
      const config = { headers: { 'content-type': 'multipart/form-data' } };

      await axios.post(uploadLink, formData, config)
        .then(res => {
          if (res.status !== 200) {
            setFeedMsg(messages[correction ? 2 : 0])
          } else {
            setFeedMsg(messages[correction ? 3 : 1])
            if (correction) {
              setEssayUploaded(true);
            } else {
              setCheck({ redacao: true });
              setProgresso(progresso + 1);
              setWasChecked(true);
            }
          }
          setFeedOpen(true);
        })
        .catch((error) => {
          console.log(error)
      });
    }
  }

  return (
    <>
      <input
        accept="image/*, application/*"
        className={classes.input}
        name="foto"
        id="contained-button-essay"
        single="true"
        type="file"
        onChange={handleUpload}
        />
      <label htmlFor="contained-button-essay">
        {
          checked
          ?   <GreenButton 
                fullWidth={true} 
                variant="contained" 
                color="primary" 
                component="span"
                startIcon={<CloudUploadIcon />}>{secondaryTitle}</GreenButton>
          :   <Button 
                fullWidth={true} 
                variant="outlined" 
                color="primary" 
                component="span"
                startIcon={<CloudUploadIcon />}>{primaryTitle}</Button>
        }
      </label>
    </>
  );
}

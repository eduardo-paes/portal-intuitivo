import React, { useState, useEffect } from "react";

import { makeStyles, Grid, Button, Accordion, AccordionSummary, AccordionDetails, Typography, Avatar, Badge } from '@material-ui/core';
import { SimpleRadio, UploadEssay, SimpleFeedback } from "../";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import DownloadIcon from '@material-ui/icons/GetApp';
import CheckCircleIcon from '@material-ui/icons/Check';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { green } from "@material-ui/core/colors";
import { jsPDF } from "jspdf";

import api from '../../api';
import axios from "axios";


const useStyles = makeStyles((theme) => ({
  myCard: {
    minHeight: 400,
    padding: '1rem'
  },
  buttonGroup: {
    textAlign: 'center'
  },
  divider: {
    marginRight: '1rem'
  },
  userName: {
    paddingTop: '0.6rem',
    paddingLeft: '1rem'
  },
  success: {
    backgroundColor: green[500],
    color: '#fafafa',
    borderRadius: '50%',
    margin: '0.5rem 0 0 0.5rem'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
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

export default function Accordions(props) {
    const { data, alunoID, redacaoID } = props;
    const classes = useStyles();
    const [notaAluno, setNotaAluno] = useState(0);
    const [feedMsg, setFeedMsg] = useState({title: '', message: ''});
    const [feedOpen, setFeedOpen] = useState(false);
    const [essayUploaded, setEssayUploaded] = useState(false);

    const [srcImg, setSrcImg] = useState('');
    const [uploadLink, setUploadLink] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    const [wasLoaded, setWasLoaded] = useState(false);
    
    useEffect(() => {
        if (alunoID && redacaoID && !wasLoaded) {
            console.log(alunoID)
            setUploadLink(`http://localhost:5000/api/upload-redacao/corrigida/${alunoID}/${redacaoID}`);
            setSrcImg(`http://localhost:5000/uploads/profile/${alunoID}.jpeg`);
            setDownloadLink(`http://localhost:5000/api/download-redacao/${alunoID}/${redacaoID}`);
            setWasLoaded(true);
        }
    // eslint-disable-next-line
    }, [alunoID, redacaoID]);

    const DownloadEssay = (event) => {
        event.preventDefault();

        axios.get(downloadLink,
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': ['application/jpg', 'application/jpeg', 'application/png', 'application/pdf',]
                }
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                const content = response.headers['content-type'];

                var aux = 'pdf';
                var nomeRedacao = `Redação - ${data.alunoID.nome}.${aux}`;
                if (content.includes('image/')) {
                    aux = content.split('image/').filter(ext => {
                        return ext !== '';
                    });
                    var doc = new jsPDF();
                    var width = doc.internal.pageSize.getWidth();
                    var height = doc.internal.pageSize.getHeight();

                    doc.addImage(url, aux, 0, 2, width, height);
                    doc.save(nomeRedacao);
                } else {
                    link.href = url;
                    link.setAttribute('download', nomeRedacao);
                    document.body.appendChild(link);
                    link.click();
                }
            })
            .catch((error) => console.log(error));
    };

    const SubmitButton = async (event) => {
        event.preventDefault();

        const progressoRedacao = {
            redacaoID: redacaoID,
            alunoID: alunoID,
            progresso: data.progresso,
            dataConclusao: data.dataConclusao,
            corrigido: true,
            nota: notaAluno
        }

        if (essayUploaded) {
            console.log(progressoRedacao);
            await api
                .atualizarProgressoRedacao(data._id, progressoRedacao)
                .then(res => {
                    console.log(res.data.message);
                })
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
    
        console.log(data)
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("foto", file);
            const config = {headers: { 'content-type': 'multipart/form-data' }};
            await axios.post(uploadLink,formData,config)
                .then(res => {
                    if (res.status !== 200) {
                        setFeedMsg(messages[2])
                    } else {
                        setFeedMsg(messages[3])
                        setEssayUploaded(true);
                    }
                    setFeedOpen(true);
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }

    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            >
                <Badge overlap="circle" badgeContent={essayUploaded && <CheckCircleIcon className={classes.success} />}>
                    <Avatar sizes="small" src={srcImg} alt="Preview"/>
                </Badge>
                <Typography className={classes.userName}>{data.alunoID.nome}</Typography>
                
            </AccordionSummary>

            <AccordionDetails>
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12}>
                        <SimpleRadio title='Nota' value={notaAluno} setValue={setNotaAluno}/>
                    </Grid>

                    <Grid item={true} xs={12}>
                        <Grid container={true} alignItems='center'spacing={1}>

                            <Grid item={true} xs={12} sm={4}>
                                <Button fullWidth={true} variant="outlined" color="primary" onClick={DownloadEssay} startIcon={<DownloadIcon />}>
                                    <i className="fas fa-download"/>
                                    Baixar Redação
                                </Button>
                            </Grid>

                            <Grid item={true} xs={12} sm={4}>
                                <input
                                    accept="image/*, application/*"
                                    className={classes.input}
                                    name="foto"
                                    id="contained-button-essay"
                                    single="true"
                                    type="file"
                                    hidden={true}
                                    onChange={handleUpload}
                                    />
                                <label htmlFor="contained-button-essay">
                                    <Button 
                                        fullWidth={true} 
                                        variant="outlined" 
                                        color="primary" 
                                        component="span"
                                        startIcon={<CloudUploadIcon />}>Enviar Correção</Button>
                                </label>

                                <SimpleFeedback
                                    open={feedOpen}
                                    setOpen={setFeedOpen}
                                    title={feedMsg.title}
                                    message={feedMsg.message}/>
                            </Grid>

                            <Grid item={true} xs={12} sm={4}>
                                <Button fullWidth={true} variant="contained" color="primary" onClick={SubmitButton} startIcon={<SaveIcon />}>
                                    Salvar
                                </Button>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}

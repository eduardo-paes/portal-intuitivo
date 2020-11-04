import React, { useState, useEffect } from "react";

// -- Componentes
import { makeStyles, Grid, Button, Accordion, AccordionSummary, AccordionDetails, Typography, Avatar, Badge } from '@material-ui/core';
import { SimpleRadio, UploadEssay, SimpleFeedback } from "../";

// -- Ícones Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import DownloadIcon from '@material-ui/icons/GetApp';
import CheckCircleIcon from '@material-ui/icons/Check';

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

export default function Accordions(props) {
    const { data } = props;
    const classes = useStyles();
    const [notaAluno, setNotaAluno] = useState(0);
    const [feedMsg, setFeedMsg] = useState({title: '', message: ''});
    const [feedOpen, setFeedOpen] = useState(false);
    const [essayUploaded, setEssayUploaded] = useState(false);

    const downloadLink = `http://localhost:5000/api/download-redacao/${data.alunoID._id}/${data.redacaoID}`;
    const srcImg = `http://localhost:5000/uploads/profile/${data.alunoID._id}.jpeg`;
    const uploadLink = `http://localhost:5000/api/upload-redacao/corrigida/${data.alunoID._id}/${data.redacaoID}`;
   
    const DownloadEssay = () => {
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

    const SubmitButton = async () => {
        const progressoRedacao = {
            redacaoID: data.redacaoID,
            alunoID: data.alunoID._id,
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
                                <UploadEssay 
                                    uploadLink={uploadLink} 
                                    checked={false} 
                                    primaryTitle="Enviar Correção" 
                                    correction={true} 
                                    setFeedMsg={setFeedMsg} 
                                    setEssayUploaded={setEssayUploaded}
                                    setFeedOpen={setFeedOpen}/>

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

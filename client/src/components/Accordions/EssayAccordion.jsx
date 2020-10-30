import React, { useState, useEffect } from "react";

import { makeStyles, Grid, Backdrop, Button, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Typography, Avatar, Badge } from '@material-ui/core';
import { SimpleRadio, UploadEssay, SimpleFeedback } from "../";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import DownloadIcon from '@material-ui/icons/GetApp';
import CheckCircleIcon from '@material-ui/icons/Check';
import axios from "axios";
import { jsPDF } from "jspdf";

import api from '../../api';
import { green } from "@material-ui/core/colors";

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

const loadingFlag = {
    srcImg: false,
    alunoID: false,
    redacaoID: false,
}

export default function Accordions(props) {
    const { data } = props;
    const classes = useStyles();
    const [srcImg, setSrcImg] = useState('');
    const [notaAluno, setNotaAluno] = useState(0);
    const [wasLoaded, setWasLoaded] = useState(loadingFlag);
    const [feedMsg, setFeedMsg] = useState({title: '', message: ''});
    const [feedOpen, setFeedOpen] = useState(false);
    const [essayUploaded, setEssayUploaded] = useState(false);
    const [alunoID, setAlunoID] = useState('');
    const [redacaoID, setRedacaoID] = useState('');
    const [backdrop, setBackdrop] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();
        if (alunoID !== '' && !wasLoaded.srcImg) {
            setSrcImg(`http://localhost:5000/uploads/profile/${data.alunoID._id}.jpeg`);
            setWasLoaded(preValue => ({
                ...preValue,
                srcImg: true,
            }));
        }

        if (data.alunoID && !wasLoaded.alunoID) {
            setAlunoID(data.alunoID._id);
            setWasLoaded(preValue => ({
                ...preValue,
                alunoID: true,
            }));
        }

        if (data.redacaoID && !wasLoaded.redacaoID) {
            setRedacaoID(data.redacaoID);
            setWasLoaded(preValue => ({
                ...preValue,
                redacaoID: true,
            }));
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [data]);

    const UploadEssayCorrection = (event) => {
        const file = event.target.files[0];
        setBackdrop(true);
        
        if (file) {
            const formData = new FormData();
            formData.append("foto", file);

            fetch(`http://localhost:5000/api/upload-redacao/corrigida/${data.alunoID._id}/${data.redacaoID}`, {
                method: 'POST',
                body: formData
            })
            .then(res => {
                if (res.status !== 200) {
                    setFeedMsg({
                        title: 'Houve um erro ao enviar sua correção',
                        message: 'Verifique se o arquivo que enviou não está corrompido ou se possui um dos seguintes formatos permitidos: .jpg, .png, .jpeg.'
                    })
                    setFeedOpen(true);
                } else {
                    setFeedMsg({
                        title: 'Correção enviada',
                        message: 'Sua correção foi enviada com sucesso e já está disponível para o aluno'
                    })
                    setBackdrop(false);
                    setFeedOpen(true);
                    setEssayUploaded(true);
                }
            })
        }
    };

    const DownloadEssay = (event) => {
        event.preventDefault();
        const downloadLink = `http://localhost:5000/api/download-redacao/${alunoID}/${redacaoID}`;

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
                    doc.addImage(url, aux, 10, 7);
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
                                <UploadEssay handleUpload={UploadEssayCorrection} alunoID={alunoID} checked={false} primaryTitle="Enviar Correção" secondaryTitle='' />

                                <SimpleFeedback
                                    open={feedOpen}
                                    setOpen={setFeedOpen}
                                    title={feedMsg.title}
                                    message={feedMsg.message}/>

                                <Backdrop className={classes.backdrop} open={backdrop}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
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
import React, { useState, useEffect } from "react";

import { makeStyles, Grid, Button, Accordion, AccordionSummary, AccordionDetails, Typography, Avatar } from '@material-ui/core';
import { SimpleRadio, UploadEssay, SimpleFeedback } from "../";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import DownloadIcon from '@material-ui/icons/GetApp';
import axios from "axios";

import api from '../../api';

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
  }
}));

export default function Accordions(props) {
    const { data } = props;
    const classes = useStyles();
    const [srcImg, setSrcImg] = useState('');
    const [notaAluno, setNotaAluno] = useState(0);
    const [wasLoaded, setWasLoaded] = useState({ srcImg: false });
    const [feedMsg, setFeedMsg] = useState({title: '', message: ''});
    const [feedOpen, setFeedOpen] = useState(false);
    const [essayUploaded, setEssayUploaded] = useState(false);

    const alunoID = data.alunoID._id, redacaoID = data.redacaoID;

    const donwloadLink = `http://localhost:5000/api/download-redacao/${alunoID}/${redacaoID}`;
    const uploadLink = `http://localhost:5000/api/upload-redacao/corrigida/${alunoID}/${redacaoID}`;
    const nomeRedacao = `Redação - ${data.alunoID.nome}.pdf`;

    useEffect(() => {
        const abortController = new AbortController();
        if (data.alunoID && !wasLoaded.srcImg) {
            setSrcImg(`http://localhost:5000/uploads/profile/${data.alunoID._id}.jpeg`);
            setWasLoaded(true);
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [data]);

    // const convertImgToPDF = () => {
    //     var doc = new jsPDF();
    //     var type = '';
    //     if (file.type === 'image/png') {
    //         type = 'PNG';
    //     } else if (file.type === 'image/jpeg') {
    //         type = 'JPEG';
    //     }
    //     doc.addImage("examples/images/Octonyan.jpg", type, 10, 10, 190, 190);
    // }

    // const pdf = new File([doc.output("blob")], "filename.pdf", {  type: "pdf" });
    //     data = new FormData();
    //     data.append("file", pdf);
    //     axios
    //         .post("/amazing-endpoint", data)
    //         .then(res => console.log(res))
    //         .catch(err =>console.log(err));

    const fetchRedacaoIMG = async (file) => {

        const formData = new FormData();
        formData.append("foto", file);
        return await fetch(uploadLink, {
                method: 'POST',
                body: formData
            })
            .then(res => {
                if (res.status !== 200) {
                    setFeedMsg({
                        title: 'Ops! Houve um erro ao enviar sua redação.',
                        message: 'Verifique se o arquivo que nos enviou não está corrompido ou se possui um dos seguintes formatos permitidos: .jpg, .png, .jpeg.'
                    })
                    setFeedOpen(true);
                    return false;
                }
                setFeedMsg({
                    title: 'Redação enviada!',
                    message: 'Aí sim! Agora é só aguardar a correção de nossos professores. Em breve você estará recebendo sua correção!'
                })
                return true;
            })
    }

    const UploadEssayCorrection = async (event) => {
        const file = event.target.files[0];
        console.log(file);

        const value = await fetchRedacaoIMG(file);
        if (value) {
            setFeedOpen(true);
            setEssayUploaded(true);
        }
    };

    const DownloadEssay = (event) => {
        event.preventDefault();
            axios.get(donwloadLink,
                {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/jpg'
                    }
                })
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', nomeRedacao);
                    document.body.appendChild(link);
                    link.click();
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
                <Avatar sizes="small" src={srcImg} alt="Preview"/>
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
                                <UploadEssay handleUpload={UploadEssayCorrection} checked={false} primaryTitle="Enviar Correção" secondaryTitle='' />

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
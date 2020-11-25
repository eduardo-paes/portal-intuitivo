//#region Importações Iniciais
import React, { useState, useEffect } from "react";

// -- Componentes
import { 
    withStyles, 
    makeStyles, 
    Grid, 
    Button,
    Avatar, 
    Badge,
    Dialog,
    Divider
} from '@material-ui/core';

import { UploadEssay, SimpleSnackMessage } from "../";
import { GeneralSubtitle, GeneralText } from "../../assets/styles/styledComponents"

// -- Ícones Material UI
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import DownloadIcon from '@material-ui/icons/GetApp';
import CheckCircleIcon from '@material-ui/icons/Check';

import { green } from "@material-ui/core/colors";
import { jsPDF } from "jspdf";

import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import api from '../../api';
import axios from "axios";
import { WirisIframe } from "../"
import SimpleList from "./Utils/SimpleList";
import { eixo1, eixo2, eixo3, competencia } from "../../utils"
//#endregion

//#region Componentes e Estilos
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    }
});

const useStyles = makeStyles((theme) => ({
    subtitle: {
        marginLeft: '1rem'
    },
    myCard: {
      minHeight: 400,
      padding: '1rem'
    },
    buttonGroup: {
      textAlign: 'center',
      alignItems: 'center',
      marginBottom: '1rem',
      padding: '0 1rem 0'
    },
    divider: {
      marginRight: '1rem'
    },
    userName: {
      paddingTop: '0.5rem',
      [theme.breakpoints.up('sm')]: {
        marginLeft: '-1.5rem',
      },
      color: "#606161",
      fontWeight: 'semi-bold'
    },
    success: {
      backgroundColor: green[500],
      color: '#fafafa',
      borderRadius: '50%',
      margin: '0.5rem 0 0 0.5rem'
    }
  }));

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);
  
const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            {children}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
        alignContent: "flex-end",
    },
}))(MuiDialogActions);
//#endregion

const eixos = {
    eixo1: {
        a1: 0,
        a2: 0,
        a3: 0,
        a4: 0,
        a5: 0,
        a6: 0,
        a7: 0,
        a8: 0,
        a9: 0,
    },
    eixo2: {
        b1: 0,
        b2: 0,
        b3: 0,
        b4: 0,
        b5: 0,
        b6: 0,
        b7: 0,
        b8: 0,
        b9: 0,
        b10: 0,
        b11: 0,
        b12: 0,
    },
    eixo3: {
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 0,
        c5: 0,
        c6: 0,
        c7: 0,
        c8: 0,
    },
    competencia: {
        d1: 0,
        d2: 0,
        d3: 0,
        d4: 0,
        d5: 0,
    }
}

export default function CorrectionEssayDialog(props) {
    const {redacaoID, data, aluno, open, setOpen, setWasChanged} = props;

    const classes = useStyles();
    const [feedMsg, setFeedMsg] = useState({title: '', message: ''});
    const [feedOpen, setFeedOpen] = useState(false);
    const [essayUploaded, setEssayUploaded] = useState(false);
    const [propostaRedacao, setPropostaRedacao] = useState('');
    const [wasLoaded, setWasLoaded] = useState({ proposta: false });
    const [uploadError, setUploadError] = useState(false);
    const [eixo1Aluno, setEixo1Aluno] = useState(eixos.eixo1);
    const [eixo2Aluno, setEixo2Aluno] = useState(eixos.eixo2);
    const [eixo3Aluno, setEixo3Aluno] = useState(eixos.eixo3);
    const [competenciaAluno, setCompetenciaAluno] = useState(eixos.competencia);

    const downloadLink = `http://localhost:5000/api/download-redacao/${aluno._id}/${redacaoID}`;
    const srcImg = `http://localhost:5000/uploads/profile/${aluno._id}.jpeg`;
    const uploadLink = `http://localhost:5000/api/upload-redacao/corrigida/${aluno._id}/${redacaoID}`;

    const fetchPropostaRedacao = async () => {
        const response = await api.encPropostaRedacao(redacaoID);
        const value = response.data;

        if (value.success) {
          setPropostaRedacao(value.data.questaoID.enunciado);
          setWasLoaded(preValue => ({
              ...preValue,
              proposta: true
          }))
        }
    }

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
        const { d1, d2, d3, d4, d5  } = competenciaAluno;
        const notaAluno = d1 + d2 + d3 + d4 + d5;

        const progressoRedacao = {
            redacaoID: redacaoID,
            alunoID: aluno._id,
            progresso: data.progresso,
            dataConclusao: data.dataConclusao,
            corrigido: true,
            nota: notaAluno,
            eixo1: eixo1Aluno,
            eixo2: eixo2Aluno,
            eixo3: eixo3Aluno,
            competencia: competenciaAluno
        }

        if (essayUploaded) {
            await api
                .atualizarProgressoRedacao(data._id, progressoRedacao)
                .then(res => {
                    console.log(res.data.message);
                })

            setFeedOpen(true)
            setUploadError(true);
            setFeedMsg({title: 'Correção finalizada com sucesso!'})
            setWasChanged(preValue => ({
                ...preValue,
                redacao: false
            }));
            closeDialog();
        } else {
            setFeedOpen(true)
            setUploadError(false);
            setFeedMsg({title: 'É preciso fazer o upload da redação corrigida para concluir a correção!'})
        }
    };

    const closeDialog = () => {
        setOpen(false);
        setEssayUploaded(false);
        setFeedOpen(false);
        setEixo1Aluno(eixos.eixo1);
        setEixo2Aluno(eixos.eixo2);
        setEixo3Aluno(eixos.eixo3);
        setCompetenciaAluno(eixos.competencia);
    }

    useEffect(() => {
        const abortController = new AbortController();
        !wasLoaded.proposta && fetchPropostaRedacao();
        return abortController.abort();
        // eslint-disable-next-line
    },[redacaoID]);

    return (
        <Dialog onClose={() => setOpen(false)} aria-labelledby="customized-dialog-title" fullWidth={true} maxWidth='md' open={open}>
            
            <DialogTitle id="customized-dialog-title">
                <Grid container={true}>
                    <Grid item={true} xs={2} sm={1}>
                        <Badge overlap="circle" badgeContent={essayUploaded && <CheckCircleIcon className={classes.success} />}>
                            <Avatar sizes="small" src={srcImg} alt="Preview"/>
                        </Badge>
                    </Grid>
                    <Grid item={true} xs={10} sm={11}>
                        <GeneralText variant="h6" className={classes.userName}>{aluno.nome}</GeneralText>
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container={true} spacing={2}>
                    <Grid id="correctionEssayPropose" item={true} xs={12}>
                        <Accordion square >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
                                <Grid container>
                                    <Grid item xs={12} style={{marginBottom: '-1rem'}}>
                                        <GeneralSubtitle>Proposta de Redação</GeneralSubtitle>
                                    </Grid>
                                    <Grid item xs={12} style={{marginBottom: '-1rem'}}>
                                        <p>Clique no botão ao lado para visualizar a proposta da redação.</p>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <WirisIframe text={propostaRedacao}/>
                            </AccordionDetails>
                        </Accordion>
                        <Divider style={{ margin: '1rem 0 1rem 0' }}/>
                    </Grid>

                    <Grid id="correctionEssayEixo1" item={true} xs={12}>
                        <Accordion square >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
                                <Grid container>
                                    <GeneralSubtitle>Eixo 1</GeneralSubtitle>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SimpleList array={eixo1} value={eixo1Aluno} setValue={setEixo1Aluno} word="A"/>
                            </AccordionDetails>
                        </Accordion>
                        <Divider style={{ margin: '1rem 0 1rem 0' }}/>
                    </Grid>

                    <Grid id="correctionEssayEixo2" item={true} xs={12}>
                        <Accordion square >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
                                <Grid container>
                                    <GeneralSubtitle>Eixo 2</GeneralSubtitle>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SimpleList array={eixo2} value={eixo2Aluno} setValue={setEixo2Aluno} word="B"/>
                            </AccordionDetails>
                        </Accordion>
                        <Divider style={{ margin: '1rem 0 1rem 0' }}/>
                    </Grid>

                    <Grid id="correctionEssayEixo3" item={true} xs={12}>
                        <Accordion square >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
                                <Grid container>
                                    <GeneralSubtitle>Eixo 3</GeneralSubtitle>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SimpleList array={eixo3} value={eixo3Aluno} setValue={setEixo3Aluno} word="C"/>
                            </AccordionDetails>
                        </Accordion>
                        <Divider style={{ margin: '1rem 0 1rem 0' }}/>
                    </Grid>

                    <Grid id="correctionEssayCompetencias" item={true} xs={12}>
                        <Accordion square >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
                                <Grid container>
                                    <GeneralSubtitle>Competências</GeneralSubtitle>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SimpleList array={competencia} value={competenciaAluno} setValue={setCompetenciaAluno} word="C"/>
                            </AccordionDetails>
                        </Accordion>
                        <Divider style={{ margin: '1rem 0 1rem 0' }}/>
                    </Grid>

                    <Grid id="correctionEssayButtons" item={true} xs={12}>
                        <Grid container={true} className={classes.buttonGroup} spacing={1}>

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
                                    setUploadError={setUploadError}
                                    setFeedOpen={setFeedOpen}/>
                            </Grid>

                            <Grid item={true} xs={12} sm={4}>
                                <Button fullWidth={true} variant="contained" color="primary" onClick={SubmitButton} startIcon={<SaveIcon />}>
                                    Salvar
                                </Button>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button autoFocus onClick={() => closeDialog()} color="primary">
                    Voltar
                </Button>
            </DialogActions>

            <SimpleSnackMessage
                open={feedOpen}
                setOpen={setFeedOpen}
                error={uploadError}
                message={feedMsg.title}/>
        </Dialog>
    );
}

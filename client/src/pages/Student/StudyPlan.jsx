import React, { useState } from "react";
import {MyContainer} from "../../assets/styles/styledComponents"
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  List,
  Slide
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useEffect } from "react";
import api from "../../api";
import PDFViewer from "../../components/PDFViewer/PDFViewer";
import { TextEditor } from "../../components";
import CloseIcon from '@material-ui/icons/Close';

// function getTheCurrentDay() {
//   const today = new Date();
//   const day = today.getDate();
 
//   let week_day = ""; 
//   switch (today.getDay()) {
//     case 0:
//       week_day = "Domingo";
//       break;
//     case 1:
//       week_day = "Segunda-Feira";
//       break;
//     case 2:
//       week_day = "Terça-Feira";
//       break;
//     case 3:
//       week_day = "Quarta-Feira";
//       break;
//     case 4:
//       week_day = "Quinta-Feira";
//       break;
//     case 5:
//       week_day = "Sexta-Feira";
//       break;    
//     case 6:
//       week_day = "Sábado";
//       break;    

//     default:
//       break;
//   }

//   return day + ", " + week_day + ", " + today.getFullYear();
// }

function getTheWeek() {

  let day = new Date().getDate();
  let year = new Date().getFullYear();
  let month = new Date().getMonth();

  let today = new Date(year, month, day);
  let firstday = new Date(2020, 0, 1, 0, 0, 0, 0);
  let week = Math.trunc(((((today.valueOf() - firstday.valueOf())/1000)/3600)/24)/7);

  return week;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function StudyPlan (props) {

  const classes = useStyles();
  // const [ content, setContent ] = useState({ conteudos: [] });
  const [ listaDisciplina, setListaDisciplina ] = useState([]);
  const [ question, setQuestion ] = useState({
    enunciado: '',
    resposta: '',
    tipoResposta: ''
  });
  const optionsLetter = ["A)", "B)", "C)", "D)", "E)", "F)", "G)"]
  let flag = 0;
  
  const [open, setOpen] = React.useState(false);
  const [check, setCheck] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFinalized = () => {
    setOpen(false);
    setCheck(true);
  };
  
  // -- Carrega as Disciplinas existentes no banco
  useEffect(() => {

    let dia = new Date().getDay();
    let unmounted = false;

    if (flag === 0) {
      async function fetchDisciplinaAPI() {
        const response = await api.listarDisciplinasPorDiaDaSemana(dia);
        const value = response.data.data;
        console.log(value);
        if (!unmounted) {
          setListaDisciplina(value);
        }  
      }
      fetchDisciplinaAPI()
      console.log(listaDisciplina);
    }
    
    return () => {unmounted = true};
    // eslint-disable-next-line   
  }, [flag]);

  // -- Carrega questão selecionada pelo usuário
  useEffect(() => {
    const abortController = new AbortController();
    async function fetchAPI() {
      const response = await api.encQuestaoPorID('5f4e56947a76e70f5b9090eb');
      const value = response.data.data;
      // eslint-disable-next-line
      setQuestion ({
          enunciado: value.enunciado,
          resposta: value.resposta,
          tipoResposta: value.tipoResposta,
      })
    }
    fetchAPI();
    return abortController.abort();
}, []);

  // useEffect(() => {
      
  //   let area = 'area';
  //   const abortController = new AbortController();
    
  //   async function fetchConteudoAPI() {
  //     const response = await api.listarConteudoPersonalizado();
  //     console.log(response);
  //     const value = response.data.data;
  //     setContent({ conteudos: value });
  //   }
  //   fetchConteudoAPI();
  //   return abortController.abort();
  //   // eslint-disable-next-line
  // }, []);


  return (
    <MyContainer>
      <header>
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12} sm={12}>
            <h1 className="heading-page">Plano de Estudo</h1>
          </Grid>
        </Grid>
        <Grid container={true} spacing={6}>
          <Grid item={true} xs={6} lg={6} sm={6}>
            <h3 className="heading-page">Estudo do dia</h3>
          </Grid>
          <Grid item={true} align="right" xs={6} lg={6} sm={6}>
            <h3 className="heading-page">{"Semana " + getTheWeek()}</h3>
          </Grid>
        </Grid>
      </header>
      <Grid container={true} spacing={6}>
        <Grid item={true} xs={12} lg={12} sm={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
                <Typography className={classes.heading}>Introdução à História</Typography>
                <Typography className={classes.secondaryHeading}>História</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container={true} spacing={6}>
                <Grid item={true} xs={12} lg={12} sm={12}>
                  <Accordion className={classes.root}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header">
                        <FormControlLabel
                          aria-label="Material de Estudo"
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={<Checkbox />}
                          className={classes.heading}
                          label="Material de Estudo"
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                      <PDFViewer source={`http://localhost:5000/uploads/content/5f4d5ec1d4822a5ad40b16c4.pdf`}/>
                    </AccordionDetails>
                  </Accordion>  
                </Grid>
                <Grid item={true} xs={12} lg={12} sm={12}>
                  <Accordion className={classes.root}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header">
                        <FormControlLabel
                          aria-label="Material de Estudo"
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={<Checkbox />}
                          className={classes.heading}
                          label="Exercício de Fixação"
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container={true} spacing={6}>
                          <Grid item={true} xs={12} lg={12} sm={12}>
                            <TextEditor 
                              id="mostrarEnunciadoQuestao"
                              text={question.enunciado}
                              readOnly={true}
                            />
                          </Grid>
                          <Grid item={true} xs={12} lg={12} sm={12}>
                            { 
                              (question.tipoResposta === "multiplaEscolha") 
                                  && question.resposta.map((item, index) => {
                                    return (
                                      <div key={index} className="optionSection">
                                        <Grid key={index} container={true} spacing={2}>
                                              <Grid item={true} xs={1} sm={1} lg={1}>
                                                <p className="optionsLetter">{optionsLetter[index]}</p>
                                              </Grid>
                                              <Grid item={true} xs={11} sm={11} lg={11}>
                                                    <TextEditor 
                                                        id="mostrarOpcoesQuestao"
                                                        text={item.opcao}
                                                        readOnly={true}
                                                    />
                                              </Grid>
                                        </Grid>
                                      </div>
                                      );
                                  })
                            }
                          </Grid>
                        </Grid>
                    </AccordionDetails>
                  </Accordion>  
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item={true} xs={12} lg={12} sm={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
                <Typography className={classes.heading}>Introdução à Química</Typography>
                <Typography className={classes.secondaryHeading}>Química</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container={true} spacing={6}>
                <Grid item={true} xs={12} lg={12} sm={12}>
                  <Checkbox disabled={true} checked={check}/>
                  <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    Material de Estudo
                  </Button>
                  <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                      <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                          <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                          Introdução à Química
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleFinalized}>
                          Finalizado
                        </Button>
                      </Toolbar>
                    </AppBar>
                    <List>
                      <PDFViewer source={`http://localhost:5000/uploads/content/5f4d5ec1d4822a5ad40b16c4.pdf`}/>
                    </List>
                  </Dialog>
                </Grid>
                <Grid item={true} xs={12} lg={12} sm={12}>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>      
    </MyContainer>
  );
};

export default StudyPlan;

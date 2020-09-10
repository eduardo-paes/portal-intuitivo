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
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  List,
  Slide,
  ListItem
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useEffect } from "react";
import api from "../../api";
import PDFViewer from "../../components/PDFViewer/PDFViewer";
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
  let firstday = new Date(2020, 8, 10, 0, 0, 0, 0);
  let week = Math.trunc(((((today.valueOf() - firstday.valueOf())/1000)/3600)/24)/7);

  return week+1;
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
  },
  finalizedButton: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  },
  material: {
    width: '100%'
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function StudyPlan (props) {

  const classes = useStyles();
  const [ content, setContent ] = useState([]);
  const [ disciplinas, setDisciplinas ] = useState([]);

  const dia = new Date().getDay();
  const diasDaSemana = [ "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado" ]
  
  const [open, setOpen] = React.useState(false);
  const [checkME, setCheckME] = React.useState(false);
  const [checkEF, setCheckEF] = React.useState(false);
  const [checkVA, setCheckVA] = React.useState(false);
  const [checkEA, setCheckEA] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFinalizedME = () => {
    setOpen(false);
    setCheckME(true);
  };
  
  // -- Carrega as Disciplinas do dia correspondente
  useEffect(() => {

    const abortController = new AbortController();

   
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinasPorDiaDaSemana(dia);
      const value = response.data.data;
      setDisciplinas(value);
    }
    fetchDisciplinaAPI();
    
    return abortController.abort();
    // eslint-disable-next-line   
  }, []);

  // -- Carrega os tópicos do dia correspondente
  useEffect(() => {
    
    let area = 'area';
    var value = [];
    const abortController = new AbortController();
    // console.log(disciplinas)
    
    async function fetchConteudoAPI() {
      for (let i = 0; i < disciplinas.length; ++i) {
        const response = await api.listarConteudoPersonalizado(disciplinas[i]._id, area, getTheWeek());
        // console.log(response);
        if (response.data.data[0]) value[i] = response.data.data;
      }
      setContent(value);
    }
    fetchConteudoAPI();
    return abortController.abort();
    // eslint-disable-next-line
  }, [disciplinas]);


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
            <h3 className="heading-page">{diasDaSemana[dia] + ", Semana " + getTheWeek()}</h3>
          </Grid>
        </Grid>
      </header>
      <Grid container={true} spacing={6}>
        {
          content.map((row, index) => {
            let topico = row[0].topico;
            console.log(topico)
            return (
              <Grid key={index} item={true} xs={12} lg={12} sm={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                      <Typography className={classes.heading}>{topico}</Typography>
                      <Typography className={classes.secondaryHeading}>{row[0].disciplina.nome}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container={true} spacing={6}>
                      <Grid item={true} xs={12} lg={12} sm={12}>
                        <Grid item={true} xs={12} lg={12} sm={12}>
                          <Checkbox disabled={true} checked={checkME}/>
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
                                  {topico}
                                </Typography>
                              </Toolbar>
                            </AppBar>
                            <Grid container={true} spacing={3}>
                              <Grid item={true} xs={12} lg={12} sm={12} align='center'>
                                <PDFViewer className={classes.material} source={`http://localhost:5000/uploads/content/${row[0]._id}.pdf`}/>
                              </Grid>
                              <Grid item={true} xs={12} lg={12} sm={12} align='center' >
                                <Button autoFocus variant='contained' color="primary" onClick={handleFinalizedME}>
                                    Finalizado
                                </Button>
                              </Grid>
                            </Grid>
                          </Dialog>
                        </Grid>
                        <Grid item={true} xs={12} lg={12} sm={12}>
                          <Checkbox disabled={true} checked={checkEF}/>
                          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                            Exercícios de Fixação
                          </Button>
                        </Grid>
                        <Grid item={true} xs={12} lg={12} sm={12}>
                          <Checkbox disabled={true} checked={checkVA}/>
                          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                            Vídeoaula
                          </Button>
                        </Grid>
                        <Grid item={true} xs={12} lg={12} sm={12}>
                          <Checkbox disabled={true} checked={checkEA}/>
                          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                            Exercícios de Aprofundamento 
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid item={true} xs={12} lg={12} sm={12}>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )
          })
        }
        
      </Grid>      
    </MyContainer>
  );
};

export default StudyPlan;

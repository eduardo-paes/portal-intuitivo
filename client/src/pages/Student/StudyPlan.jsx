import React, { useState } from "react";
import {MyContainer} from "../../assets/styles/styledComponents"
import {
  //MenuItem,
  Grid,
  //Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useEffect } from "react";
import api from "../../api";

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

function StudyPlan (props) {

  // const [ content, setContent ] = useState({ conteudos: [] });
  const [ listaDisciplina, setListaDisciplina ] = useState([]);
  let flag = 0;
  
  // -- Carrega as Disciplinas existentes no banco
  useEffect(() => {

    let dia = new Date().getDay();
    let id = '000000000000000000000000';
    let unmounted = false;

    if (flag !== 0) {
      async function fetchDisciplinaAPI() {
        const response = await api.listarDisciplinasPorDiaDaSemana(id, dia);
        const value = response.data.data;
        console.log(value);
        if (!unmounted) {
          setListaDisciplina(value);
          console.log(listaDisciplina);
        }  
      }
      fetchDisciplinaAPI()
    }
    
    return () => {unmounted = true};
  }, [flag]);

  // -- Carrega as Disciplinas existentes no banco
  useEffect(() => {
    
    const abortController = new AbortController();
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinas();
      const value = response.data.data;
      setListaDisciplina(value);
      console.log(listaDisciplina)
    }
    fetchDisciplinaAPI()
    return abortController.abort();
    // eslint-disable-next-line    
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
              <h2 className="heading-page">Tópico 1</h2>
            </AccordionSummary>
            <AccordionDetails>
              <h2>{}</h2>  
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>      
    </MyContainer>
  );
};

export default StudyPlan;

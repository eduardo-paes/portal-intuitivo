import React, { useState } from "react";
import { MyContainer } from "../../assets/styles/styledComponents";
import { Grid, Typography } from '@material-ui/core';
import { useEffect } from "react";
import api from "../../api";
import ContentAccordion from "../../components/Accordions/ContentAccordion";

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

function StudyPlan (props) {
  let topico = [];
  const [ content, setContent ] = useState([]);
  const [ disciplinas, setDisciplinas ] = useState([]);

  const dia = new Date().getDay();
  const diaDaSemana = [ "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado" ]
  
  // -- Carrega as Disciplinas do dia correspondente
  useEffect(() => {
    const abortController = new AbortController();
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinasPorDiaDaSemana(dia - 1);
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
            <Typography id="studyPlanTitle" variant="h4">Plano de Estudo</Typography>
          </Grid>
        
          <Grid item={true} xs={6} lg={6} sm={6}>
            <Typography id="studyPlanSubTitle" variant="h6">Estudo do dia</Typography>
          </Grid>
          
          <Grid item={true} align="right" xs={6} lg={6} sm={6}>
            <Typography id="studyPlanSubTitle" variant="h6">{diaDaSemana[dia] + ", Semana " + getTheWeek()}</Typography>
          </Grid>
        </Grid>
      </header>
      <Grid container={true} spacing={6}>
        {
          content.map((row, index) => {
            topico[index] = row[0].topico;
            return (
              <Grid key={index} item={true} xs={12} lg={12} sm={12}>
                <ContentAccordion id={row[0]._id} topico={row[0].topico} disciplina={row[0].disciplina}/>
              </Grid>
            )
          })
        }
        
      </Grid>      
    </MyContainer>
  );
};

export default StudyPlan;

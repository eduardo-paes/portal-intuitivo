import React, { useState } from "react";
import { GeneralTitle, GeneralSubtitle, MyContainer } from "../../assets/styles/styledComponents";
import { Grid, makeStyles } from '@material-ui/core';
import { useEffect } from "react";
import api from "../../api";
import ContentAccordion from "../../components/Accordions/ContentAccordion";

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    padding: 0
  },
  // heading: {
  //   [theme.breakpoints.down('sm')]: {
  //     fontSize: theme.typography.pxToRem(17)
  //   }
  // },
  secondaryHeading: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(16)
    }
  },
  studyPlan: {
    width: '100%',
    // padding: 0
  }
}));

function getTheWeek() {

  let day = new Date().getDate();
  let year = new Date().getFullYear();
  let month = new Date().getMonth();

  let today = new Date(year, month, day);
  let firstday = new Date(2020, 8, 16, 0, 0, 0, 0);
  let week = Math.trunc(((((today.valueOf() - firstday.valueOf())/1000)/3600)/24)/7);

  return week+1;
}

function StudyPlan (props) {
  const classes = useStyles();
  const borderColor = [
    'rgba(127, 63, 180, 1)',
    'rgba(63, 191, 63, 1)',
    'rgba(63, 63, 191, 1)',
    'rgba(220, 200, 63, 1)',
  ];
  const [ disciplinas, setDisciplinas ] = useState([]);

  const dia = new Date().getDay();
  const diaDaSemana = [ "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado" ]

  // -- Carrega as Disciplinas do dia correspondente
  useEffect(() => {
    const abortController = new AbortController();
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinasPorDiaDaSemana(2);
      const value = response.data.data;
      setDisciplinas(value);
    }
    fetchDisciplinaAPI();
    return abortController.abort();
    // eslint-disable-next-line   
  }, []);

  function returnContent() {
    if (disciplinas.length === 0) {
      return <p>Não há conteúdo a ser estudado hoje, portanto, aproveite o descanso!</p>
    } else {
      return disciplinas.map((row, index) => {

        return (
          <Grid 
            className={classes.grid} 
            key={index} 
            item={true} 
            xs={12} 
            lg={12} 
            sm={12}
          >
            <ContentAccordion 
              color={borderColor[index]}
              area={row.areaConhecimento}
              id={row._id} 
              disciplina={row.nome}
              week={getTheWeek()}
            />
          </Grid>
        )
      })
    }
  }

  return (
    <MyContainer className={classes.studyPlan}>
      
      <header>
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12} sm={12}>
            <GeneralTitle id="studyPlanTitle">Plano de Estudo</GeneralTitle>
          </Grid>
        
          <Grid item={true} xs={6} lg={6} sm={6}>
            <GeneralSubtitle className={classes.secondaryHeading} id="studyPlanSubTitle">Estudo do dia</GeneralSubtitle>
          </Grid>
          
          <Grid item={true} align="right" xs={6} lg={6} sm={6}>
            <GeneralSubtitle className={classes.secondaryHeading} id="studyPlanSubTitle">{diaDaSemana[dia] + ", Semana " + getTheWeek()}</GeneralSubtitle>
          </Grid>
        </Grid>
      </header>
      <Grid container={true} spacing={2}>
        {returnContent()}
      </Grid>      
    </MyContainer>
  );
};

export default StudyPlan;

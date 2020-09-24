import React, { useState } from "react";
import { GeneralTitle, GeneralSubtitle, MyContainer } from "../../assets/styles/styledComponents";
import { Grid, makeStyles } from '@material-ui/core';
import { useEffect } from "react";
import api from "../../api";
import ContentAccordion from "../../components/Accordions/ContentAccordion";
import {getTheWeek, diaDaSemana} from '../../utils/auxFunctions';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    padding: 0
  },
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

function StudyPlan (props) {
  const classes = useStyles();
  const borderColor = [
    'rgba(127, 63, 180, 1)',
    'rgba(63, 191, 63, 1)',
    'rgba(63, 63, 191, 1)',
    'rgba(220, 200, 63, 1)',
  ];
  const [ disciplinas, setDisciplinas ] = useState([]);
  const [ content, setContent ] = React.useState([]); 

  const dia = new Date().getDay();

  // -- Carrega as Disciplinas do dia correspondente
  useEffect(() => {
    const abortController = new AbortController();
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinasPorDiaDaSemana(dia+1);
      const value = response.data.data;
      setDisciplinas(value);
    }
    fetchDisciplinaAPI();
    return abortController.abort();
    // eslint-disable-next-line   
  }, []);

  // -- Carrega os tópicos do dia correspondente
  useEffect(() => {
    const abortController = new AbortController();
    let topicos = [];
    console.log(disciplinas);

    if (disciplinas.length > 0) {
        async function fetchConteudoAPI() {
            for (let i = 0; i < disciplinas.length; ++i) {
              const response = await api.encConteudoPersonalizado(disciplinas[i]._id, getTheWeek());
              if (response.data.data[0]) topicos.push(response.data.data[0]);
              console.log(topicos);
            }
            setContent(topicos);
        }
        fetchConteudoAPI();
    }
    
    return abortController.abort();
    // eslint-disable-next-line
}, [disciplinas]);

  function returnContent() {
    if (content.length === 0) {
      return <p>Não há conteúdo a ser estudado hoje, portanto, aproveite o descanso!</p>
    } else {
      return content.map((row, index) => {

        console.log(row);

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
              topicoID={row._id} 
              nome={row.topico}
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

import React, { useState, useEffect } from "react";
import { GeneralTitle, GeneralSubtitle, MyContainer } from "../../assets/styles/styledComponents";
import { getTheWeek, diaDaSemana } from '../../utils/auxFunctions';
import { Grid, makeStyles } from '@material-ui/core';
import { ContentAccordion } from "../../components";
import api from "../../api";

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

export default function StudyPlan () {
  const classes = useStyles();
  const borderColor = [
    '#eb7120',
    '#94c93d',
    '#a283bc',
    '#fdc504',
    '#39b2d2',
  ];
  const [ disciplinas, setDisciplinas ] = useState([]);
  const [ content, setContent ] = useState([]); 

  const dia = new Date().getDay();

  // -- Carrega as Disciplinas do dia correspondente
  useEffect(() => {
    const abortController = new AbortController();
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinasPorDiaDaSemana(5);
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
    
    if (disciplinas.length > 0) {
        async function fetchConteudoAPI() {
            for (let i = 0; i < disciplinas.length; ++i) {
              const response = await api.encConteudoPersonalizado(disciplinas[i]._id, 2);
              if (response.data.data[0]) topicos.push(response.data.data[0]);
            }
            setContent(topicos);
        }
        fetchConteudoAPI();
    }
    
    return abortController.abort();
    // eslint-disable-next-line
}, [disciplinas]);

  const returnContent = () => {
    if (content.length === 0) {
      return <p>Não há conteúdo a ser estudado hoje, portanto, aproveite o descanso!</p>
    } else {
      return content.map((row, index) => {
        let disciplinaNome = disciplinas.find( element => element._id === row.disciplinaID )
        
        return (
          <Grid className={classes.grid} key={index} item={true} xs={12} lg={12} sm={12}>
            <ContentAccordion 
              color={borderColor[index]}
              area={row.areaConhecimento}
              disciplina={disciplinaNome.nome}
              topicoID={row._id} 
              nome={row.topico}
              week={getTheWeek()}
              linkAula={row.videoAulaURL}
            />
          </Grid>
        )
      })
    }
  }

  return (
    <MyContainer className={classes.studyPlan}>
      <section id="studyPlanHeader">
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
      </section>
      
      <section id="studyPlanMain">
        <Grid container={true} spacing={2}>
          {returnContent()}
        </Grid>      
      </section>
    </MyContainer>
  );
};

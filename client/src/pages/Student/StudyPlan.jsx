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
  const [disciplinas, setDisciplinas] = useState([]);
  const [content, setContent] = useState([]); 
  const [revision, setRevision] = useState([]); 

  const dia = 5;

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

  // -- Carrega revisão por numeração e área
  useEffect(() => {
    const abortController = new AbortController();
    if (dia >= 5 || dia === 0) {
        async function fetchRevisaoAPI() {
          const response = await api.encRevisaoPelaNumeracaoEArea(1, 'Ciências da Natureza');
          setRevision(response.data.data);
        }
        fetchRevisaoAPI();
    }
    return abortController.abort();
    // eslint-disable-next-line
  }, [dia])

  // -- Retorna acordeões dos tópicos
  function returnContent() {
    if (content.length === 0) {
      return <p>Não há conteúdo a ser estudado hoje, portanto, aproveite o descanso!</p>
    } else {
      return content.map((row, index) => {
        let disciplinaNome = disciplinas.find( element => element._id === row.disciplinaID )
        return (
          <Grid className={classes.grid} key={index} item={true} xs={12} lg={12} sm={12}>
            <ContentAccordion 
              color={borderColor[index]}
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

  // -- Retorna acordeões dos ADs
  function returnRevision() {
    return (
      <Grid className={classes.grid} item={true} xs={12} lg={12} sm={12}>
        <ContentAccordion 
          color={borderColor[borderColor.length-1]}
          area={revision.areaConhecimento}
          disciplina={"Avaliação Diagnóstica"}
          revisaoID={revision._id} 
          nome={"Semana 2"}
          questoesAvDiag={revision.questoes}
          week={getTheWeek()}
        />
      </Grid>
    )
  }

  // -- Retorna acordeão de redação
  function returnEssay() {
    return (
      <Grid className={classes.grid} item={true} xs={12} lg={12} sm={12}>
        <ContentAccordion 
          color={borderColor[borderColor.length-2]}
          area={"Linguagens"}
          disciplina={"Redação"}
          topicoID={""} 
          nome={"Semana 2"}
          week={getTheWeek()}
        />
      </Grid>
    )
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
          { returnContent() }
          { returnEssay() }
          { revision && returnRevision() }
        </Grid>
      </section>
    </MyContainer>
  );
};

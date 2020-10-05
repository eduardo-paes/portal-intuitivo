import React, { useState, useEffect } from "react";

// -- Material UI
import { Grid, makeStyles, Typography } from '@material-ui/core';

// -- Local Components
import { GeneralTitle, GeneralSubtitle, MyContainer } from "../../assets/styles/styledComponents";
import { ContentAccordion, AccordionSkeleton } from "../../components";

// -- External Functions
import { currentWeek, diaDaSemana } from '../../utils/auxFunctions';
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

  const [content, setContent] = useState([]); 
  const [revision, setRevision] = useState([]); 
  const [essay, setEssay] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [thisWeek, setThisWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [isMounting, setIsMounting] = useState({
    content: true,
    revision: true,
    essay: true
  })

  const areaConhecimento = [
    'Ciências Humanas',
    'Ciências da Natureza',
    'Linguagens',
    'Matemática'
  ]

  async function gettingCurrentDate() {
    const auxWeek = await currentWeek();
    const auxDay = new Date().getDay();
    setThisWeek(auxWeek);
    setCurrentDay(auxDay);
  }

  async function fetchConteudoAPI() {
    const response = await api.listarConteudoCorrente(thisWeek, currentDay);
    const value = response.data;
    if (value.success) {
      setContent(value.data);
      setIsLoaded(true);
      setIsMounting(preValue => ({
        ...preValue,
        content: false
      }))
    }
  }

  async function fetchRevisaoAPI() {
    const response = await api.encRevisaoPelaNumeracaoEArea(1, 'Ciências da Natureza');
    const value = response.data;
    if (value.success) {
      setRevision(value.data);
      setIsMounting(preValue => ({
        ...preValue,
        revision: false
      }))
    }
  }

  async function fetchRedacaoAPI() {
      const response = await api.encRedacaoDaSemana(2);
      const value = response.data;
      if (value.success) {
        setEssay(value.data);
        setIsMounting(preValue => ({
          ...preValue,
          essay: false
        }))
      }
  }

  // -- Carrega tópicos por semana e dia da semana
  useEffect(() => {
    const abortController = new AbortController();
    if (thisWeek && currentDay) {
      let day = (currentDay >= 5 || currentDay === 0);

      (isMounting.content) && fetchConteudoAPI();                               // Carrega tópicos do dia
      (thisWeek > 3 && day && isMounting.revision) && fetchRevisaoAPI();        // Carrega ADs da semana
      (isMounting.essay) && fetchRedacaoAPI();                                  // Carrega Redação da semana
    } else {
      gettingCurrentDate();
    }
    return abortController.abort();
    // eslint-disable-next-line
  }, [thisWeek, currentDay]);

  // RETORNO DOS ACORDEÕES COM OS RESPECTIVOS CONTEÚDOS
  // ==================================================

  // -- Retorna acordeões dos tópicos
  function returnContent() {
    if (isLoaded && content.length === 0) {
      return (
        <Grid className={classes.grid} item={true}>
          <Typography id="secondaryHeading" className={classes.secondaryHeading}>Não há conteúdo a ser estudado hoje, portanto, aproveite o descanso!</Typography>
        </Grid>
      )
    } 
    
    else if(!isLoaded) {
      return AccordionSkeleton();
    }
    
    else {
      return content.map((row, index) => {
        return (
          <Grid className={classes.grid} key={index} item={true} xs={12} lg={12} sm={12}>
            <ContentAccordion 
              color={borderColor[index]}
              disciplinaNome={row.disciplinaID.nome}
              topicoID={row._id} 
              titulo={row.topico}
              linkAula={row.videoAulaURL}
              tipoAcordeao="planoEstudo"
              week={thisWeek}
            />
          </Grid>
        )
      })
    }
  }

  // -- Retorna acordeões dos ADs
  function returnRevision() {
    if (revision.length) {
      return (
        <Grid className={classes.grid} item={true} xs={12} lg={12} sm={12}>
          <ContentAccordion 
            color={borderColor[borderColor.length-1]}
            area={revision.areaConhecimento}
            disciplinaNome={"Avaliação Diagnóstica"}
            revisaoID={revision._id} 
            titulo={"Semana 2"}
            questoesAvDiag={revision.questoes}
            tipoAcordeao="planoEstudo"
            week={thisWeek}
          />
        </Grid>
      )
    }
  }

  // -- Retorna acordeão de redação
  function returnEssay() {
    if (essay.length > 0) {
      return (
        <Grid className={classes.grid} item={true} xs={12} lg={12} sm={12}>
          <ContentAccordion 
            color={borderColor[borderColor.length-2]}
            area={"Linguagens"}
            disciplinaNome={"Redação"}
            topicoID={essay[0].topicoID._id} 
            titulo={"Redação de " + essay[0].disciplinaID.nome}
            tipoAcordeao="planoEstudo"
            week={thisWeek}
          />
        </Grid>
      )
    }
  }

  return (
    <MyContainer id="studentPageContainer">
      <section id="studyPlanHeader">
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={12} sm={12}>
            <GeneralTitle id="studyPlanTitle">Plano de Estudo</GeneralTitle>
          </Grid>
        
          <Grid item={true} xs={6} lg={6} sm={6}>
            <GeneralSubtitle className={classes.secondaryHeading} id="studyPlanSubTitle">Estudo do dia</GeneralSubtitle>
          </Grid>
          
          <Grid item={true} align="right" xs={6} lg={6} sm={6}>
            <GeneralSubtitle className={classes.secondaryHeading} id="studyPlanSubTitle">{diaDaSemana[currentDay] + ", Semana " + thisWeek}</GeneralSubtitle>
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

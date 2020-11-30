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

const areas = ['Ciências Humanas', 'Ciências Naturais', 'Linguagens', 'Matemática']

export default function StudyPlan () {
  const classes = useStyles();
  const borderColor = [
    '#eb7120',
    '#94c93d',
    '#a283bc',
    '#fdc504',
    '#39b2d2',
  ];

  // Armazena conteúdo dos acordeões
  const [content, setContent] = useState([]); 
  const [essay, setEssay] = useState(0);
  const [revision, setRevision] = useState(0); 

  // Armazena informações sobre dia e semana corrente
  const [thisWeek, setThisWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);

  // Armazena informações de montagem
  const [isLoaded, setIsLoaded] = useState({
    content: false,
    essay: false,
    revision: false
  });
  const [isMounting, setIsMounting] = useState({
    content: true,
    revision: true,
    essay: true
  })

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
      setIsMounting(preValue => ({
        ...preValue,
        content: false
      }))
    }

    setIsLoaded(preValue => ({
      ...preValue,
      content: true
    }));
  }

  async function fetchRevisaoAPI() {
    const areaDoMes = areas[(thisWeek-3) % 4];
    const response = await api.encRevisaoPelaNumeracaoEArea(1, areaDoMes);
    const value = response.data;

    if (value.success) {
      setRevision(value.data);
      setIsMounting(preValue => ({
        ...preValue,
        revision: false
      }))
    }

    setIsLoaded(preValue => ({
      ...preValue,
      revision: true
    }));
  }

  async function fetchRedacaoAPI() {
    const response = await api.encRedacaoDaSemana(2);
    const value = response.data;
    
    if (value.success) {
      setEssay(value.data[0]);
      setIsMounting(preValue => ({
        ...preValue,
        essay: false
      }))
    }
    setIsLoaded(preValue => ({
      ...preValue,
      essay: true
    }));
  }

  // -- Carrega tópicos por semana e dia da semana
  useEffect(() => {
    const abortController = new AbortController();

    if (thisWeek && currentDay >= 0) {
      let day = (currentDay >= 5 || currentDay === 0);
      // let day = true;

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
    if (isLoaded.content && isLoaded.revision && isLoaded.essay) {
      if (!content.length && !revision && !essay) {
        return (
          <Grid className={classes.grid} item={true}>
            <Typography id="secondaryHeading" className={classes.secondaryHeading}>Não há conteúdo a ser estudado hoje, portanto, aproveite o descanso!</Typography>
          </Grid>
        )
      } else {
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
    else {
      return AccordionSkeleton(3);
    }
  }

  // -- Retorna acordeões dos ADs
  function returnRevision() {
    if (isLoaded.content && isLoaded.revision && isLoaded.essay) {
      if (revision) {
        return (
          <Grid className={classes.grid} item={true} xs={12} lg={12} sm={12}>
            <ContentAccordion 
              color={borderColor[borderColor.length-1]}
              area={revision.areaConhecimento}
              disciplinaNome={revision.tipoAtividade}
              revisaoID={revision._id} 
              revision={revision}
              titulo={revision.tipoAtividade}
              questoesAvDiag={revision.questoes}
              tipoAcordeao="planoEstudo"
              week={thisWeek}
            />
          </Grid>
        )
      }
    } else {
      return AccordionSkeleton(1);
    }
  }

  // -- Retorna acordeão de redação
  function returnEssay() {
    if (isLoaded.content && isLoaded.revision && isLoaded.essay) {
      if (essay) {
        return (
          <Grid className={classes.grid} item={true} xs={12} lg={12} sm={12}>
            <ContentAccordion 
              color={borderColor[borderColor.length-2]}
              area={"Linguagens"}
              disciplinaNome={"Redação"}
              essay={essay} 
              titulo={"Redação de " + essay.disciplinaID.nome}
              tipoAcordeao="planoEstudo"
              week={thisWeek}
            />
          </Grid>
        )
      }
    } else {
      return AccordionSkeleton(1);
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
          { returnRevision() }
        </Grid>
      </section>
    </MyContainer>
  );
};

import React, { useState, useContext, useEffect } from "react";
import apis from '../../api';
import { StoreContext } from "../../utils";

import { MyContainer, MyCard, MyCardContent, GeneralTitle, GeneralSubtitle } from "../../assets/styles/styledComponents"
import { makeStyles } from '@material-ui/core/styles';
import { Grid, List, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';

import LinearProgressBar from "../../components/ProgressBar/LinearProgressBar";
import CircularStatic from "../../components/ProgressBar/CircularStatic";
import QuestionCircularStatic from "../../components/ProgressBar/QuestionProgress";
import { set } from "mongoose";

// -- Estilos locais
const useStyles = makeStyles(theme => ({
  exampleCard: {
    minHeight: "15rem"
  },
  content: {
    fontStyle: 'normal',
    fontWeight: `300`,
    fontSize: '1rem',
    marginTop: '1rem',
    color: '#606161',
  },
  phrase: {
    fontSize: '1rem'
  },
  questionProgress: {
    marginLeft: '2rem',
  },
  subTitle: {
    fontStyle: 'normal',
    fontWeight: `500`,
    fontSize: '1.25rem',
    marginTop: '1rem',
    color: '#606161',
  },
  title: {
    fontStyle: 'normal',
    fontWeight: `300`,
    fontSize: '1.25rem',
    marginTop: '1rem',
    color: '#606161',
  }
}));

export default function Dashboard (props) {
  const classes = useStyles();
  const [wasLoaded, setWasLoaded] = useState(false);
  const [analiseAluno, setAnaliseAluno] = useState();
  const [progressoDiario, setProgressoDiario] = useState([]);
  const { token } = useContext(StoreContext)
  const alunoID = token.userID;

  async function gerarAnalise() {
    const res = await apis.gerarAnaliseAluno(alunoID);
    console.log(res);
    if (res) setAnaliseAluno(res.data);
    const dis = await apis.gerarProgressoDiario(alunoID, 5, 2);
    if (dis) setProgressoDiario(dis.data.progressos);
  }

  useEffect(() => {
    const abortController = new AbortController();
    gerarAnalise();
    return abortController.abort();
    // eslint-disable-next-line
  }, []);

  return (
    <MyContainer id="studentPageContainer">

      <section id="cabecalhoDashboard">
        <GeneralTitle className="heading-page">Dashboard</GeneralTitle>
      </section>

      <section id="muralDashboard">
        <Grid container={true} spacing={2}>

          <Grid item={true} xs={12} sm={12}>
            <LinearProgressBar />
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title}>Tarefas do Dia</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <List className={classes.root}>
                  {
                    progressoDiario.length !== 0 ? 
                    progressoDiario.map(row => {
                      
                      return row.numTask ? (
                        <ListItem>
                          <ListItemAvatar>
                            <CircularStatic 
                              wasLoaded={wasLoaded} 
                              setWasLoaded={setWasLoaded} 
                              numTasks={row.numTask} 
                              progresso={row.progresso}/>
                          </ListItemAvatar>
                          <ListItemText primary={row.topico} secondary={row.nome} />
                        </ListItem>
                      ) : null
                    })
                    : null
                  }
                </List>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title}>Melhor Desempenho</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.title}>{analiseAluno ? analiseAluno.melhorDesempenho.disciplina : null}</GeneralSubtitle>
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={analiseAluno ? analiseAluno.melhorDesempenho.acertos * (100/analiseAluno.melhorDesempenho.questoes): 0}/>
                  <GeneralSubtitle className={classes.subTitle}>{`${analiseAluno ? analiseAluno.melhorDesempenho.acertos : 0} / ${analiseAluno ? analiseAluno.melhorDesempenho.questoes : 0}`}</GeneralSubtitle>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title}>A Melhorar</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.title}>{analiseAluno ? analiseAluno.piorDesempenho.disciplina : null}</GeneralSubtitle>
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={analiseAluno ? analiseAluno.piorDesempenho.acertos * (100/analiseAluno.piorDesempenho.questoes): 0}/>
                  <GeneralSubtitle className={classes.subTitle}>{`${analiseAluno ? analiseAluno.piorDesempenho.acertos : 0} / ${analiseAluno ? analiseAluno.piorDesempenho.questoes : 0}`}</GeneralSubtitle>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title}>Precisa de Atenção</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.title}>{analiseAluno ? analiseAluno.piorTopico.topico : null}</GeneralSubtitle>
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={analiseAluno ? analiseAluno.piorTopico.acertos * (100/analiseAluno.piorTopico.questoes): 0}/>
                  <GeneralSubtitle className={classes.subTitle}>{`${analiseAluno ? analiseAluno.piorTopico.acertos : 0} / ${analiseAluno ? analiseAluno.piorTopico.questoes : 0}`}</GeneralSubtitle>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

        </Grid>
      </section>

    </MyContainer>
  );
};

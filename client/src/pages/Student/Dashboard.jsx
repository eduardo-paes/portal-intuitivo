import React, { useState, useContext, useEffect } from "react";
import apis from '../../api';
import { StoreContext } from "../../utils";

import { MyContainer, MyCard, MyCardContent, GeneralTitle, GeneralSubtitle } from "../../assets/styles/styledComponents"
import { makeStyles } from '@material-ui/core/styles';
import { Grid, List, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';

import LinearProgressBar from "../../components/ProgressBar/LinearProgressBar";
import CircularStatic from "../../components/ProgressBar/CircularStatic";
import QuestionCircularStatic from "../../components/ProgressBar/QuestionProgress";

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
  const { token } = useContext(StoreContext)
  const alunoID = token.userID;

  async function gerarAnalise() {
    const res = await apis.gerarAnaliseAluno(alunoID);
    console.log(res);
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
                  <ListItem>
                    <ListItemAvatar>
                      <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={1} progresso={4}/>
                    </ListItemAvatar>
                    <ListItemText primary="Introdução à História" secondary="História" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={1} progresso={2}/>
                    </ListItemAvatar>
                    <ListItemText primary="Introdução à Física" secondary="Física" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={1} progresso={0}/>
                    </ListItemAvatar>
                    <ListItemText primary="Redação" secondary="Semana 17" />
                  </ListItem>
                </List>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title}>Melhor Desempenho</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.title}>História</GeneralSubtitle>
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={111/119}/>
                  <GeneralSubtitle className={classes.subTitle}>111 / 119</GeneralSubtitle>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title}>A Melhorar</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.title}>Matemática</GeneralSubtitle>
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={67/107}/>
                  <GeneralSubtitle className={classes.subTitle}>67 / 107</GeneralSubtitle>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title}>Precisa de Atenção</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.title}>Álgebra Linear</GeneralSubtitle>
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={12/57}/>
                  <GeneralSubtitle className={classes.subTitle}>12 / 57</GeneralSubtitle>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

        </Grid>
      </section>

    </MyContainer>
  );
};

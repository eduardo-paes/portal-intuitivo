import React from "react";

import { MyContainer, MyCard, MyCardContent, GeneralTitle, GeneralSubtitle } from "../../assets/styles/styledComponents"
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import WeeklyProgress from "../../components/ProgressBar/WeeklyProgress";
import CircularStatic from "../../components/ProgressBar/CircularStatic";
import QuestionCircularStatic from "../../components/ProgressBar/QuestionProgress";

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  
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

  return (
    <MyContainer>

      <section id="cabecalhoDashboard">
        <GeneralTitle className="heading-page">Dashboard</GeneralTitle>
      </section>

      <section id="muralDashboard">
        <Grid container={true} spacing={2}>

          <Grid item={true} xs={12} sm={12}>
            <WeeklyProgress />
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title} id="tarefas">Tarefas do Dia</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <List className={classes.root}>
                  <ListItem>
                    <ListItemAvatar>
                      <CircularStatic progresso={4}/>
                    </ListItemAvatar>
                    <ListItemText primary="Introdução à História" secondary="História" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <CircularStatic progresso={2}/>
                    </ListItemAvatar>
                    <ListItemText primary="Introdução à Física" secondary="Física" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <CircularStatic progresso={0}/>
                    </ListItemAvatar>
                    <ListItemText primary="Redação" secondary="Semana 17" />
                  </ListItem>
                </List>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <h2 className={classes.title} id="melhorDesempenho">Química</h2>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <GeneralSubtitle className={classes.subTitle}>111 / 119</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={3.731092437}/>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <h2 className={classes.title} id="piorDesempenho">Sociologia</h2>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <GeneralSubtitle className={classes.subTitle}>67 / 107</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={2.504672897}/>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <GeneralSubtitle className={classes.title} id="questoes">Questões</GeneralSubtitle>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.content}>Questões realizadas: 682</GeneralSubtitle>
                  <h3 className={classes.content}>Média de Acertos</h3>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={2.72}/>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>

        </Grid>
      </section>

    </MyContainer>
  );
};

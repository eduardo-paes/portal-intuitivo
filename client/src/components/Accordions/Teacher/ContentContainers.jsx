import React from 'react';
import { GeneralText } from '../../../assets/styles/styledComponents';
import { Grid, Tooltip, useMediaQuery, useTheme } from '@material-ui/core'
import CircularStatic from '../../ProgressBar/CircularStatic';
import clsx from 'clsx';

const GradeCard = (props) => {
  const {classes, media, parte, total, setWasLoaded, wasLoaded} = props;

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.rankContainer} style={{paddingBottom: "0.5rem"}}>
        <Grid container>
          <Grid item xs={8} sm={9} style={{paddingRight: "0.2rem"}}>
            <GeneralText className={classes.leftTitle}>Nota Média da Turma</GeneralText>
            <GeneralText className={classes.gradeText} style={{textAlign: "left"}}>Desempenho médio com base no resultado das atividades.</GeneralText>
          </Grid>
          <Grid item xs={4} sm={3} className={classes.itemGridRank} style={{justifyContent: "flex-end"}}>
            <GeneralText className={clsx(classes.resultGrade, classes.helper)}>{media}</GeneralText>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} className={classes.rankContainer}>
        <Grid container>
          <Grid item xs={8} sm={9} style={{paddingRight: "0.2rem"}}>
            <GeneralText className={classes.leftTitle}>Questões</GeneralText>
            <GeneralText className={classes.gradeText} style={{textAlign: "left"}}>Relação entre acertos e total de questões realizadas.</GeneralText>
          </Grid>
          <Grid item xs={4} sm={3} className={classes.itemGridRank} style={{justifyContent: "flex-end"}}>
            <div className={classes.helper} style={{padding: "0 0.8rem"}}>
              <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={total} progresso={parte}/>
              <GeneralText className={classes.gradeText}>{parte}/{total}</GeneralText>
              <Tooltip title="Acertos/Total" >
                <GeneralText className={classes.avgLabel}>A/T</GeneralText>
              </Tooltip>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const StudentRank = (props) => {
  const {aluno, best, classes, nota, isLast} = props;
  var title = best ? 'Melhor Desempenho' : 'Pior Desempenho';

  return (
    <Grid container className={clsx(classes.container, classes.rankContainer)}>
      <Grid item xs={8} sm={10} md={9} className={classes.itemGridRank}>
        <div>
          <GeneralText className={classes.leftTitle}>{title}</GeneralText>
          <GeneralText className={classes.gridSubtitle}>{aluno}</GeneralText>
        </div>
      </Grid>
      <Grid item xs={4} sm={2} md={3} className={classes.itemGridRank} style={{justifyContent: "flex-end"}}>
        <div style={{ paddingLeft: "1rem" }}>
          <GeneralText className={classes.avgGrade}>{nota}</GeneralText>
          <GeneralText className={classes.gradeText}>Nota Média</GeneralText>
        </div>
      </Grid>
    </Grid>
  )
}

const ContentRank = (props) => {
  const {best, classes, conteudo, isLast, nota, parte, total, setWasLoaded, wasLoaded} = props;
  var title = best ? 'Melhor Desempenho' : 'Pior Desempenho';

  return (
    <Grid container className={clsx(classes.container, classes.rankContainer)}>
      <Grid item xs={12} sm={6}>
        <GeneralText className={classes.leftTitle}>{title}</GeneralText>
        <GeneralText className={classes.gridSubtitle}>{conteudo}</GeneralText>
      </Grid>
      <Grid item xs={8} sm={4} className={classes.itemGridRank}>
        <div style={{ paddingLeft: "1rem" }}>
          <GeneralText className={classes.avgGrade}>{nota}</GeneralText>
          <GeneralText className={classes.gradeText}>Nota Média</GeneralText>
        </div>
      </Grid>
      <Grid item xs={4} sm={2} className={classes.itemGridRank} style={{justifyContent: "flex-end", padding: "0 0.5rem"}}>
        <div className={classes.subjectResults}>
          <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={total} progresso={parte}/>
          <GeneralText className={classes.gradeText}>{parte}/{total}</GeneralText>
          <Tooltip title="Estudado/Total" >
            <GeneralText className={classes.avgLabel}>E/T</GeneralText>
          </Tooltip>
        </div>
      </Grid>
    </Grid>
  )
}

const FrequencyCard = (props) => {
  const { classes, messages, dataFrequency, wasLoaded, setWasLoaded } = props;

  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container className={classes.container}>
      {
        dataFrequency.map((item, index) => {
          return (
            <Grid item xs={12} sm={12} md={4} style={{ marginTop: (index > 0 && smScreen) && "1rem"}}>
              <Grid container className={classes.rankContainer}>
                <Grid item xs={8} style={{paddingRight: "0.2rem"}}>
                  <GeneralText className={classes.leftTitle}>{messages[index].title}</GeneralText>
                  <GeneralText className={classes.gradeText} style={{textAlign: "left"}}>{messages[index].message}</GeneralText>
                </Grid>
                <Grid item xs={4} className={classes.itemGridRank} style={{justifyContent: "flex-end"}}>
                  <div className={clsx(classes.helper, classes.resultFrequency)}>
                    <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={item.total} progresso={item.parte}/>
                    <GeneralText className={classes.gradeText}>{item.parte}/{item.total}</GeneralText>
                    <Tooltip title={item.tootip} >
                      <GeneralText className={classes.avgLabel}>{item.tip}</GeneralText>
                    </Tooltip>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

export {
  GradeCard,
  StudentRank,
  ContentRank,
  FrequencyCard
};
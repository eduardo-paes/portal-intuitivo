import React, { useState } from 'react';
import { GeneralText } from '../../../assets/styles/styledComponents';
import { makeStyles, Card, Grid, Divider } from '@material-ui/core';
import CircularStatic from '../../ProgressBar/CircularStatic';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  areaCard: {
    minHeight: "15rem",
    padding: '1rem',
    textAlign: "center",
  },
  areaTitle: {
    fontSize: '1.3rem',
    marginBottom: "1rem"
  },
  areaSubtitle: {
    fontSize: '0.9rem',
    textAlign: "left",
    marginTop: "0.1rem",
  },
  areaName: {
    fontSize: '0.9rem',
    textAlign: "center",
    marginTop: "0.1rem"
  },
  areaLeft: {
    fontSize: '1.3rem',
    textAlign: "left",
    marginTop: "0.6rem"
  },
  areaRight: {
    fontSize: '1.2rem',
    fontWeight: '500'
  },
  avgGrade: {
    fontSize: '1.5rem',
    marginTop: '0.7rem',
    paddingTop: '0.7rem'
  },
  avgGradeTitle: {
    textAlign: "left",
    marginTop: "0.1rem",
  },
  dataGridContainer:{
    marginBottom: "1rem",
    padding: "0 0.6rem 0 0.6rem",
    minWidth: "17rem"
  },
  divider: {
    color: "#606161",
    marginTop: "0.7rem",
    textAlign: "center"
  },
  gradeBox: {
    height: "3.5rem",
    borderLeft: "1px solid #bbbbbb",
    borderRight: "1px solid #bbbbbb",
  },
  gridProgress: {
    textAlign: "center",
  },
  gridLabel: {
    paddingTop: "-1rem"
  },
}));

const DataGrid = (props) => {
  const {classes, wasLoaded, setWasLoaded, isLast, disciplina, media, parte, total} = props;

  return (
    <div className={classes.dataGridContainer}>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={6} className={classes.gridLabel}>
          <GeneralText className={classes.areaLeft}>{disciplina}</GeneralText>
          <GeneralText className={classes.areaSubtitle}>Média/Frequência</GeneralText>
        </Grid>
        
        <Grid item xs={3} sm={3} className={classes.gridProgress}>
          <div className={classes.gradeBox}>
            <GeneralText className={classes.avgGrade}>{media}</GeneralText>
          </div>
        </Grid>

        <Grid item xs={3} sm={3} className={classes.gridProgress}>
          <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={total} progresso={parte}/>
          <GeneralText className={classes.areaRight}>{parte}/{total}</GeneralText>
        </Grid>
      </Grid>
      <Divider hidden={isLast} variant="fullWidth" className={classes.divider} />
    </div>
  )
}

export default function SubjectCard(props) {
  const classes = useStyles();
  const { areaConhecimento } = props;
  const [wasLoaded, setWasLoaded] = useState(false);

  return (
    <Card className={classes.areaCard}>
        <GeneralText className={classes.areaName}>{areaConhecimento}</GeneralText>
        <GeneralText className={classes.areaTitle}>Maior Desempenho</GeneralText>

        <DataGrid 
          classes={classes}
          disciplina="História"
          media={81.4}
          parte={39}
          total={48}
          wasLoaded={wasLoaded}
          setWasLoaded={setWasLoaded}
          isLast={false}
        />

        <GeneralText className={classes.areaTitle}>Menor Desempenho</GeneralText>
        <DataGrid 
          classes={classes}
          disciplina="Matemática"
          media={64.3}
          parte={12}
          total={40}
          wasLoaded={wasLoaded}
          setWasLoaded={setWasLoaded}
          isLast={true}
        />
    </Card>
  );
}
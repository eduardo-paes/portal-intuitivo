import React, { useState } from 'react';
import { GeneralText } from '../../../assets/styles/styledComponents';
import { makeStyles, Card, Grid, Divider } from '@material-ui/core';
import CircularStatic from '../../ProgressBar/CircularStatic';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  areaCard: {
    minHeight: "25rem",
    padding: '1rem',
    textAlign: "center"
  },
  areaTitle: {
    fontSize: '1.3rem',
    marginBottom: "1rem"
  },
  areaSubtitle: {
    fontSize: '0.9rem',
    textAlign: "left",
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
    fontSize: '1.8rem',
    marginTop: '0.5rem',
    marginRight: "1rem"
  },
  avgGradeTitle: {
    textAlign: "left",
    marginTop: "0.1rem",
  },
  dataGridContainer:{
    marginBottom: "1rem",
    padding: "0 0.6rem 0 0.6rem"
  },
  divider: {
    color: "#606161",
    marginTop: "0.7rem",
    textAlign: "center"
  },
  gridProgress: {
    textAlign: "right",
  },
  gridLabel: {
    paddingTop: "-1rem"
  },
}));

const DataGrid = (props) => {
  const {classes, wasLoaded, setWasLoaded, isLast} = props;
  const {titulo, subtitulo, parte, total} = props;

  return (
    <div className={classes.dataGridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={8} sm={8} className={classes.gridLabel}>
          <GeneralText className={classes.areaLeft}>{titulo}</GeneralText>
          <GeneralText className={classes.areaSubtitle}>{subtitulo}</GeneralText>
        </Grid>

        <Grid item xs={4} sm={4} className={classes.gridProgress}>
          <div style={{textAlign: "center"}}>
            <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={total} progresso={parte}/>
            <GeneralText className={classes.areaRight}>{parte}/{total}</GeneralText>
          </div>
        </Grid>
      </Grid>
      <Divider hidden={isLast} variant="fullWidth" className={classes.divider} />
    </div>
  )
}

const AvgGrade = (props) => {
  const {classes, isLast, titulo, media} = props;

  return (
    <div className={classes.dataGridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} className={classes.gridLabel}>
          <GeneralText className={classes.avgGradeTitle}>{titulo}</GeneralText>
        </Grid>

        <Grid item xs={6} sm={6} className={classes.gridProgress}>
          <GeneralText className={classes.avgGrade}>{media}</GeneralText>
        </Grid>
      </Grid>
      <Divider hidden={isLast} variant="fullWidth" className={classes.divider} />
    </div>
  )
}

const dataValues = [
  {
    titulo: "Atividades",
    subtitulo: "Realizados/Total"
  },
  {
    titulo: "Questões",
    subtitulo: "Acertos/Total"
  },
  {
    titulo: "Material de Estudo",
    subtitulo: "Estudado/Total"
  },
  {
    titulo: "Videoaula",
    subtitulo: "Visto/Total"
  }
]

export default function AreaCard(props) {
  const classes = useStyles();
  const { areaConhecimento } = props;
  const [wasLoaded, setWasLoaded] = useState(false);

  return (
    <Card className={classes.areaCard}>
        <GeneralText className={classes.areaTitle}>{areaConhecimento}</GeneralText>

        <AvgGrade 
          classes={classes}
          media={71.4}
          titulo="Média geral dos Alunos"
          isLast={false}
        />

        {
          dataValues.map((item, index) => {
            var isLast = false;
            if (3 === index) {
              isLast = true;
            }
            return (
              <DataGrid 
                key={index}
                classes={classes}
                total={58}
                parte={37}
                titulo={item.titulo}
                subtitulo={item.subtitulo}
                wasLoaded={wasLoaded}
                setWasLoaded={setWasLoaded}
                isLast={isLast}
              />
            )
          })
        }
    </Card>
  );
}
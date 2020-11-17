import React, { useState } from 'react';
import { GeneralText } from '../../assets/styles/styledComponents';
import { makeStyles, Card, Grid, Divider } from '@material-ui/core';
import CircularStatic from '../ProgressBar/CircularStatic';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  areaCard: {
    minHeight: "25rem",
    padding: '1rem',
    textAlign: "center"
  },
  areaTitle: {
    fontSize: '1.5rem',
    fontWeight: '500',
    marginBottom: "0.8rem"
  },
  areaSubtitle: {
    fontSize: '0.9rem',
    fontWeight: '500',
    textAlign: "left",
    margin: "0.1rem 0 0 1rem"
  },
  areaLeft: {
    fontSize: '1.3rem',
    fontWeight: '500',
    textAlign: "left",
    margin: "0.6rem 0 0 1rem"
  },
  areaRight: {
    fontSize: '1.2rem',
    fontWeight: '500'
  },
  gridProgress: {
    textAlign: "center",
  },
  gridLabel: {
    paddingTop: "-1rem"
  },
  divider: {
    color: "#606161",
    margin: "0.7rem 1rem 0 1rem",
    textAlign: "center"
  },
}));

const DataGrid = (props) => {
  const {classes, wasLoaded, setWasLoaded} = props;
  const {titulo, subtitulo, parte, total} = props;

  return (
    <>
      <Grid item xs={6} sm={6} className={classes.gridLabel}>
        <GeneralText className={classes.areaLeft}>{titulo}</GeneralText>
        <GeneralText className={classes.areaSubtitle}>{subtitulo}</GeneralText>
      </Grid>

      <Grid item xs={6} sm={6} className={classes.gridProgress}>
        <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={total} progresso={parte}/>
        <GeneralText className={classes.areaRight}>{parte}/{total}</GeneralText>
      </Grid>
    </>
  )
}

export default function AreaCard(props) {
  const classes = useStyles();
  const { areaConhecimento } = props;
  const [wasLoaded, setWasLoaded] = useState(false);

  return (
    <Card className={classes.areaCard}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <GeneralText className={classes.areaTitle}>{areaConhecimento}</GeneralText>
        </Grid>

        <DataGrid 
          classes={classes}
          total={58}
          parte={37}
          titulo="Atividades"
          subtitulo="Acertos/Total"
          wasLoaded={wasLoaded}
          setWasLoaded={setWasLoaded}
        />
      </Grid>
      <Divider variant="fullWidth" className={classes.divider} />
    </Card>
  );
}
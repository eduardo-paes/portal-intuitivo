import React from 'react';
import { GeneralText, GeneralTitle, MyContainer } from '../../assets/styles/styledComponents';
import { makeStyles, Card, Grid } from '@material-ui/core';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  areaCard: {
    minHeight: "25rem",
    padding: '1rem',
    textAlign: "center"
  },
  areaTitle: {
    fontSize: '1.4rem',
    fontWeight: '500'
  }
}));

export default function AreaCard(props) {
  const classes = useStyles();
  const { title } = props;

  return (
    <Card className={classes.areaCard}>
      <GeneralText className={classes.areaTitle}>{title}</GeneralText>
    </Card>
  );
}
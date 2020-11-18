import React, { useState } from 'react';
import { GeneralSubtitle, GeneralTitle, MyContainer } from '../../assets/styles/styledComponents';
import { makeStyles, Grid } from '@material-ui/core';
import { AreaCard, SubjectCard } from '../../components';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  generalSubtitle: {
    marginTop: '1rem'
  }
}));

const desempenhoArea = [
  {
    label: 'Linguagem'
  },
  {
    label: 'Matemática'
  },
  {
    label: 'Ciências Humanas'
  },
  {
    label: 'Ciências da Natureza'
  }
]

export default function AdminAnalysis() {
  const classes = useStyles();

  return (
    <MyContainer>

      <section id="cabeçalho">
        <GeneralTitle>Desempenho Geral</GeneralTitle>
      </section>

      <section id="desempenhoPrioritario">
        <GeneralSubtitle>Desempenho por Área</GeneralSubtitle>
        <Grid container spacing={2}>
          {
            desempenhoArea.map((item, index) => {
              return (
                <Grid item key={index} xs={12} sm={4} md={3} style={{minWidth: "16rem"}}>
                  <AreaCard areaConhecimento={item.label}/>
                </Grid>
              );
            })
          }
        </Grid>
      </section>

      <section id="desempenhoExtra">
        <GeneralSubtitle className={classes.generalSubtitle}>Disciplinas em Destaque</GeneralSubtitle>
        <Grid container spacing={2}>
          {
            desempenhoArea.map((item, index) => {
              return (
                <Grid item key={index} xs={12} sm={4} md={3}>
                  <SubjectCard areaConhecimento={item.label}/>
                </Grid>
              );
            })
          }
        </Grid>
      </section>

    </MyContainer>
  );
}
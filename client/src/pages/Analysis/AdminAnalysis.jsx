import React, { useState } from 'react';
import { GeneralSubtitle, GeneralText, GeneralTitle, MyContainer } from '../../assets/styles/styledComponents';
import { makeStyles, Card, Grid } from '@material-ui/core';
import AreaCard from '../../components/Cards/AreaCard';

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
  const [desPrior, setDesPrior] = useState(desempenhoArea)

  return (
    <MyContainer>

      <section id="cabeçalho">
        <GeneralTitle>Desempenho Geral</GeneralTitle>
      </section>

      <section id="desempenhoPrioritario">
        <GeneralSubtitle>Desempenho por Área</GeneralSubtitle>
        <Grid container spacing={2}>
          {
            desPrior.map((item, index) => {
              console.log(item)
              return (
                <Grid item key={index} xs={12} sm={3}>
                  <AreaCard areaConhecimento={item.label}/>
                </Grid>
              );
            })
          }
        </Grid>
      </section>

      <section id="desempenhoSecundario">
        <GeneralSubtitle className={classes.generalSubtitle}>Engajamento por Área</GeneralSubtitle>
      </section>

      <section id="desempenhoExtra">
        <GeneralSubtitle className={classes.generalSubtitle}>Disciplinas em Destaque</GeneralSubtitle>
      </section>

    </MyContainer>
  );
}
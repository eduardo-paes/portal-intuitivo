import React from "react";

import { MyContainer, MyCard, MyCardContent } from "../../assets/styles/styledComponents"
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  subTitle: {
    fontStyle: 'normal',
    fontWeight: `500`,
    // color: #606161,
  },
  exampleCard: {
    minHeight: "12.5rem"
  }
}));

export default function Dashboard (props) {
  const classes = useStyles();

  return (
    <MyContainer>

      <section id="cabecalhoDashboard">
        <h1 className="heading-page">Dashboard</h1>
      </section>

      <section id="muralDashboard">
        <Grid container={true} spacing={2}>

          <Grid item={true} xs={12} sm={9}>
            <h2 className="subtitle-student">Mural</h2>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                Conteúdo do Mural
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <h2 className="subtitle-student">Eventos</h2>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                Próximos eventos
              </MyCardContent>
            </MyCard>
          </Grid>

        </Grid>
      </section>

      <section id="topicosDoDiaDashboard">
        <h2 className="subtitle-student">Tópicos do Dia</h2>

        <Grid container={true} spacing={2}>
          
          <Grid item={true} xs={12} sm={4}>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                Tópico 1
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={4}>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                Tópico 2
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={4}>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                Tópico 3
              </MyCardContent>
            </MyCard>
          </Grid>

        </Grid>
      </section>

      <section id="conteudoExtraDashboard">
        <h2 className="subtitle-student">Dicas do Especialista</h2>

        <Grid container={true} spacing={2}>
          
          <Grid item={true} xs={12} sm={6}>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                Dica 1
              </MyCardContent>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={6}>
            <MyCard>
              <MyCardContent className={classes.exampleCard}>
                Dica 2
              </MyCardContent>
            </MyCard>
          </Grid>

        </Grid>
      </section>

    </MyContainer>
  );
};

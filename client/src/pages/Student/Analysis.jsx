import React, { useContext, useState } from 'react';
import { GeneralSubtitle, GeneralText, GeneralTitle, MyCard, MyContainer } from '../../assets/styles/styledComponents';
import { StoreContext } from "../../utils";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { Grid } from '@material-ui/core';
import CircularStatic from '../../components/ProgressBar/CircularStatic';

const useStyles = makeStyles((theme) => ({
  contentCard: {
    width: '100%',
    minHeight: 300,
    padding: '1rem',
    backgroundColor: theme.palette.background.paper,
  },
  listCard: {
    width: '100%',
    padding: '1rem',
    backgroundColor: theme.palette.background.paper,
  },
  subtitleList: {
    // padding: '1rem',
  },
  sumario: {
    textAlign: "center",
  },
  caixa: {
    flex: 6,
    flexDirection: "flex-end",
  },
  legenda: {
    fontSize: "0.8rem"
  },
  resultado: {
    fontSize: "1.3rem"
  },
  observacao: {
    fontSize: "0.8rem",
    paddingTop: "1rem"
  }
}));

function MostraRedacao(index) {
  console.log(index);
}

function renderRow(props) {
  const { index, style, data } = props;

  return (
    <ListItem button style={style} key={index} onClick={() => MostraRedacao(index)}>
      <ListItemText primary={`Item ${index + 1}`}  />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default function StudentAnalysis() {
  const classes = useStyles();
  const { token } = useContext(StoreContext)
  const [wasLoaded, setWasLoaded] = useState(false);
  const alunoID = token.userID;
  const dataRealizacao = new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(Date.now());
  const notaAluno = 78.1;
  const numTotal = 5, numRealizado = 4;

  return (
    <MyContainer>
      <GeneralTitle>Meus Resultados</GeneralTitle>

      <section id="resultadoRedacoes">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <MyCard className={classes.contentCard}>
              <GeneralSubtitle>Redações</GeneralSubtitle>
              <GeneralText>{`Data Realização: ${dataRealizacao}`}</GeneralText>
              <GeneralText>{`Nota: ${notaAluno}`}</GeneralText>
            </MyCard>
          </Grid>

          <Grid item xs={12} sm={4}>
            <MyCard className={classes.contentCard}>
              <GeneralSubtitle>Média Acumulada</GeneralSubtitle>
              <Grid container spacing={1} justify="center">
                <Grid id='nota' item xs={12} sm={6} className={classes.sumario}>
                  <div className={classes.caixa}>
                    <GeneralText className={classes.resultado}>{notaAluno}</GeneralText>
                    <GeneralText className={classes.legenda}>Resultado Médio</GeneralText>
                  </div>
                </Grid>
                
                <Grid id='progresso' item xs={12} sm={6} className={classes.sumario}>
                  <div className={classes.caixa}>
                    <CircularStatic 
                      wasLoaded={wasLoaded} 
                      setWasLoaded={setWasLoaded} 
                      numTasks={numTotal} 
                      progresso={numRealizado}/>
                    <GeneralText className={classes.resultado}>{`${numRealizado}/${numTotal}`}</GeneralText>
                    <GeneralText className={classes.legenda}>Realizadas/Total</GeneralText>
                  </div>
                </Grid>
                
                <Grid id='observacao' item xs={12}>
                  <GeneralText className={classes.observacao}>Média calculada com base nos resultados obtidos em todas as redações realizadas.</GeneralText>
                </Grid>
              </Grid>
            </MyCard>
          </Grid>

          <Grid item xs={12} sm={4}>
            <MyCard className={classes.listCard}>
              <GeneralSubtitle className={classes.subtitleList}>Redações Feitas</GeneralSubtitle>
              <FixedSizeList height={215} itemSize={46} itemCount={8} itemData={{ data: "dados serão enviados por aqui" }}>
                { renderRow }
              </FixedSizeList>
            </MyCard>
          </Grid>
        </Grid>
      </section>

      <section id="resultadoADs">

      </section>
    </MyContainer>
  );
}
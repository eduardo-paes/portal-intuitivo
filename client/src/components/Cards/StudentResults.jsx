import React, { useState } from 'react';
import { GeneralSubtitle, GeneralText, MyCard } from '../../assets/styles/styledComponents';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { Button, Grid } from '@material-ui/core';
import CircularStatic from '../../components/ProgressBar/CircularStatic';
import DescriptionIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  contentCard: {
    width: '100%',
    minHeight: 284,
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
  caixaNota: {
    flex: 6,
    flexDirection: "flex-end",
    borderRight: "1px solid #ddd"
  },
  caixaRedacoes: {
    borderLeft: "1px solid #ddd",
    paddingLeft: "0.5rem"
  },
  legenda: {
    fontSize: "0.8rem"
  },
  resultado: {
    fontSize: "1.3rem"
  },
  resultadoNota: {
    padding: "1rem 0 0.8rem 0",
    fontSize: "2rem"
  },
  rightSubtitle: {
    textAlign: "right",
    fontSize: "0.8rem",
    [theme.breakpoints.down('sm')]: {
      fontSize: "0.7rem",
    }
  },
  rightText: {
    fontSize: "1.2rem",
    textAlign: "right",
  },
  subtitle: {
    fontSize: "0.8rem",
  },
  observacao: {
    fontSize: "0.8rem",
    padding: "2rem 0.5rem 0 0.5rem"
  }
}));

export default function StudentResults(props) {
  const classes = useStyles();
  const {msg1, msg2, msg3, dataRealizacao, listagem, notaAluno, title1, title2, title3} = props;
  const [wasLoaded, setWasLoaded] = useState(false);
  const numTotal = 5, numRealizado = 4;

  function renderRow(props) {
    const { index, style } = props;

    function MostraRedacao(itemID) {
      console.log(itemID);
    }

    return (
      <ListItem button style={style} key={index} onClick={() => MostraRedacao(listagem[index].id)}>
        <ListItemText primary={listagem[index].title}  />
      </ListItem>
    );
  }

  renderRow.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
  };

  return (
    <Grid container spacing={2}>
      {/* Resultado da Redação */}
      <Grid item xs={12} sm={4}>
        <MyCard className={classes.contentCard}>
          <GeneralSubtitle>{title1}</GeneralSubtitle>
          <Grid container spacing={2}>
            <Grid item xs={7} sm={8}>
              <GeneralText className={classes.subtitle}>{msg1}</GeneralText>
              <GeneralText className={classes.subtitle}>{msg2}</GeneralText>
            </Grid>

            <Grid item xs={5} sm={4}>
              <div className={classes.caixaRedacoes}>
                <GeneralText className={classes.rightText}>{dataRealizacao}</GeneralText>
                <GeneralText className={classes.rightSubtitle}>Data Realização</GeneralText>
                <GeneralText className={classes.rightText} style={{paddingTop: "0.7rem"}}>{notaAluno}</GeneralText>
                <GeneralText className={classes.rightSubtitle}>Resultado Obtido</GeneralText>
              </div>
            </Grid>

            <Grid item xs={12}style={{paddingTop: "0.5rem"}}>
              <Button 
                fullWidth={true} 
                variant="contained" 
                color="primary" 
                component="span"
                startIcon={<DescriptionIcon />}>Visualizar Correção</Button>
              <Button 
                fullWidth={true} 
                variant="contained" 
                color="primary" 
                component="span"
                style={{marginTop: "0.5rem"}}
                startIcon={<InfoIcon />}>Mais Detalhes</Button>
            </Grid>
          </Grid>
        </MyCard>
      </Grid>

      {/* Média Acumulada */}
      <Grid item xs={12} sm={4}>
        <MyCard className={classes.contentCard}>
          <GeneralSubtitle>{title2}</GeneralSubtitle>
          <Grid container spacing={1} justify="center">
            <Grid id='nota' item xs={6} sm={6} className={classes.sumario}>
              <div className={classes.caixaNota}>
                <GeneralText className={classes.resultadoNota}>{notaAluno}</GeneralText>
                <GeneralText className={classes.legenda}>Resultado Médio</GeneralText>
              </div>
            </Grid>
            
            <Grid id='progresso' item xs={6} sm={6} className={classes.sumario}>
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
              <GeneralText className={classes.observacao}>{msg3}</GeneralText>
            </Grid>
          </Grid>
        </MyCard>
      </Grid>
      
      {/* Lista de Redações Feitas */}
      <Grid item xs={12} sm={4}>
        <MyCard className={classes.listCard}>
          <GeneralSubtitle className={classes.subtitleList}>{title3}</GeneralSubtitle>
          <FixedSizeList height={200} itemSize={46} itemCount={8}>
            { renderRow }
          </FixedSizeList>
        </MyCard>
      </Grid>
    </Grid>
  );
}

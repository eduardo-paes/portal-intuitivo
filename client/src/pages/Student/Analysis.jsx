import React, { useContext } from 'react';
import { GeneralSubtitle, GeneralText, GeneralTitle, MyCard, MyContainer } from '../../assets/styles/styledComponents';
import { StoreContext } from "../../utils";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { Grid } from '@material-ui/core';

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
  }
}));

function renderRow(props) {
  const { index, style, data } = props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={`Item ${index + 1}`} />
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
  const alunoID = token.userID;
  const dataRealizacao = new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(Date.now());
  const notaAluno = 78.1;

  return (
    <MyContainer>
      <GeneralTitle>Meus Resultados</GeneralTitle>

      <section id="resultadoRedacoes">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <MyCard className={classes.contentCard}>
              <GeneralSubtitle>Redações</GeneralSubtitle>
              <GeneralText>{`Data Realização: ${dataRealizacao}`}</GeneralText>
              <GeneralText>{`Nota: ${notaAluno}`}</GeneralText>
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
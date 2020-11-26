import React, { useContext, useState } from 'react';
import { GeneralSubtitle, GeneralText, GeneralTitle, MyCard, MyContainer } from '../../assets/styles/styledComponents';
import { StoreContext } from "../../utils";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { Button, Grid } from '@material-ui/core';
import CircularStatic from '../../components/ProgressBar/CircularStatic';
import DescriptionIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/Info';
import clsx from 'clsx';
import { StudentResults } from '../../components';

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

const listagemRedacoes = [
  {
    title: "Redação 1",
    id: 11
  },
  {
    title: "Redação 2",
    id: 22
  },
  {
    title: "Redação 3",
    id: 33
  },
  {
    title: "Redação 4",
    id: 44
  },
  {
    title: "Redação 5",
    id: 55
  },
  {
    title: "Redação 6",
    id: 66
  },
  {
    title: "Redação 7",
    id: 77
  },
  {
    title: "Redação 8",
    id: 88
  }
]

const listagemADs = [
  {
    title: "AD 1",
    id: 11
  },
  {
    title: "AD 2",
    id: 22
  },
  {
    title: "AD 3",
    id: 33
  },
  {
    title: "AD 4",
    id: 44
  },
  {
    title: "AD 5",
    id: 55
  },
  {
    title: "AD 6",
    id: 66
  },
  {
    title: "AD 7",
    id: 77
  },
  {
    title: "AD 8",
    id: 88
  }
]

export default function StudentAnalysis() {
  const classes = useStyles();
  const { token } = useContext(StoreContext)
  const [wasLoaded, setWasLoaded] = useState(false);
  const alunoID = token.userID;
  const dataRealizacao = new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(Date.now());
  const notaRedacaoo = 78.1;
  const notaAD = 81.1;

  return (
    <MyContainer>
      <GeneralTitle>Meus Resultados</GeneralTitle>

      <section id="resultadoRedacoes">
        <StudentResults 
          title1="Redações"
          title2="Média Acumulada"
          title3="Redações Feitas"
          msg1="Acesso o link abaixo a fim de visualizar mais informações sobre seus erros e acertos nesta redação."
          msg2="Caso tenha alguma dúvida, contate o seu professor."
          msg3="Média calculada com base nos resultados obtidos em todas as redações realizadas até o momento."
          dataRealizacao={dataRealizacao}
          notaAluno={notaRedacaoo}
          listagem={listagemRedacoes}
        />
      </section>

      <section id="resultadoADs" style={{marginTop: "2rem"}}>
        <StudentResults 
          title1="Avaliações Diagnóstica"
          title2="Média Acumulada"
          title3="ADs Feitas"
          msg1="Acesso o link abaixo a fim de visualizar mais informações sobre seus erros e acertos nesta avaliação diagnóstica."
          msg2="Caso tenha alguma dúvida, contate seus professores."
          msg3="Média calculada com base nos resultados obtidos em todas as avaliações realizadas até o momento."
          dataRealizacao={dataRealizacao}
          notaAluno={notaAD}
          listagem={listagemADs}
        />
      </section>
    </MyContainer>
  );
}
import React, { useState, useEffect } from "react";
import { MyContainer, GeneralTitle, MyCard } from "../../assets/styles/styledComponents"
import { EssayFullWidthTabs } from "../../components";
import { makeStyles } from '@material-ui/core/styles';
import api from "../../api";

const useStyles = makeStyles((theme) => ({
  myCard: {
    // maxWidth: 300
  }
}));

export default function EssayToCorrect (props) {
  const essayID = props.match.params.atividadeID;
  const classes = useStyles();
  const [redacoes, setRedacoes] = useState([]);
  const [wasLoaded, setWasLoaded] = useState({
    redacoes: false
  });

  const fetchRedacoes = async () => {
    if (!redacoes.length) {
      const response = await api.listarRedacoesNaoCorrigidasPorRedacaoID(essayID);
      const value = response.data;

      if (value.success) {
        setRedacoes(value.data);
        setWasLoaded(preValue => ({
          ...preValue,
          redacoes: true
        }))
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    
    if (!wasLoaded.redacoes) {
      fetchRedacoes();
    }

    return abortController.abort();
    // eslint-disable-next-line
  },[essayID]);

  return (
    <MyContainer id="studentPageContainer">
      <section id="cabecalhoCorrigirRedacao">
        <GeneralTitle className="heading-page">Correção de Redação</GeneralTitle>
      </section>

      <section id="muralCorrigirRedacao">
        <MyCard className={classes.myCard}>
          <EssayFullWidthTabs data={redacoes} />
        </MyCard>
      </section>
    </MyContainer>
  );
};

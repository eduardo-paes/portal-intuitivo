import React, { useState, useEffect } from "react";
import { MyContainer, GeneralTitle, MyCard, GeneralSubtitle } from "../../assets/styles/styledComponents"
import { makeStyles, Grid } from '@material-ui/core';
import { EssayAccordion, WirisIframe } from "../../components";

import api from "../../api";

const useStyles = makeStyles((theme) => ({
  myCard: {
    minHeight: 400,
    padding: '1rem'
  },
  divider: {
    marginRight: '1rem'
  }
}));

export default function EssayToCorrect (props) {
  const essayID = props.match.params.atividadeID;
  const {history} = props;
  const classes = useStyles();
  const [redacoes, setRedacoes] = useState([]);
  const [propostaRedacao, setPropostaRedacao] = useState('');
  const [wasLoaded, setWasLoaded] = useState({
    redacoes: false,
    proposta: false,
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

  const fetchPropostaRedacao = async () => {
    const response = await api.encPropostaRedacao(essayID);
    const value = response.data;

    if (value.success) {
      setPropostaRedacao(value.data.questaoID.enunciado);
      setWasLoaded(preValue => ({
          ...preValue,
          proposta: true
      }))
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    !wasLoaded.proposta && fetchPropostaRedacao();
    !wasLoaded.redacoes && fetchRedacoes();
    return abortController.abort();
    // eslint-disable-next-line
  },[essayID]);

  useEffect(() => {
    const abortController = new AbortController();
    if (wasLoaded.redacoes && !redacoes.length) {
      history.push("/controle-correcoes")
    }
    return abortController.abort();
    // eslint-disable-next-line
  }, [redacoes])

  return (
    <MyContainer id="studentPageContainer">
      <section id="cabecalhoCorrigirRedacao">
        <GeneralTitle className="heading-page">Correção de Redação</GeneralTitle>
      </section>

      <section id="muralCorrigirRedacao">
        <Grid container={true} spacing={2} align='center'>
          
          <Grid item={true} xs={12} sm={6} align='left'>
            <MyCard className={classes.myCard}>
              <GeneralSubtitle>Proposta de Redação</GeneralSubtitle>
              <WirisIframe text={propostaRedacao}/>
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={6} align='center'>
            { 
              redacoes.length &&
                redacoes.map((row, index) => {
                  return (
                    <EssayAccordion key={index} data={row}/>
                  )
                })
            }
          </Grid>
          
        </Grid>
      </section>
    </MyContainer>
  );
};

import React, { useState, useEffect } from "react";
import { MyContainer, GeneralTitle, MyCard, GeneralSubtitle, MyCardContent } from "../../assets/styles/styledComponents"
import { makeStyles, Grid, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Typography, Avatar } from '@material-ui/core';
import { SimpleRadio } from "../../components";

import Image from 'material-ui-image'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import api from "../../api";

const useStyles = makeStyles((theme) => ({
  myCard: {
    minHeight: 400,
    padding: '1rem'
  },
  buttonGroup: {
    textAlign: 'center'
  },
  button: {
    margin: '0.5rem'
  },
  divider: {
    marginRight: '1rem'
  },
  userName: {
    paddingTop: '0.6rem',
    paddingLeft: '1rem'
  }
}));

export default function EssayToCorrect (props) {
  const essayID = props.match.params.atividadeID;
  const classes = useStyles();

  const [redacoes, setRedacoes] = useState([]);
  const [propostaRedacao, setPropostaRedacao] = useState('');
  const [imgURL, setImgURL] = useState('');
  
  const [wasLoaded, setWasLoaded] = useState({
    redacoes: false,
    proposta: false
  });

  const fetchRedacoes = async () => {
    if (!redacoes.length) {
      const response = await api.listarRedacoesNaoCorrigidasPorRedacaoID(essayID);
      const value = response.data;
      
      if (value.success) {
        console.log(value.data);
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
    if (!wasLoaded.proposta) {
      fetchPropostaRedacao();
    }
    if (!wasLoaded.redacoes) {
      fetchRedacoes();
    }
    return abortController.abort();
    // eslint-disable-next-line
  },[essayID]);


  function ListarPorAluno() {
    const [notaAluno, setNotaAluno] = useState(0);


    return (
      <>
        {
          redacoes.length !== 0 ? 
          redacoes.map((row, index) => {

            const srcImg = `http://localhost:5000/uploads/profile/${row.alunoID._id}.jpeg`;

            return (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Avatar sizes="small" src={srcImg} alt="Preview"/>
                  <Typography className={classes.userName}>{row.alunoID.nome}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container={true} spacing={1}>

                    <Grid item={true} sm={12}>
                      <SimpleRadio title='Nota' value={notaAluno} setValue={setNotaAluno}/>
                    </Grid>

                    <Grid item={true} sm={12}>
                      <Button className={classes.button} variant="outlined" color="primary">
                        Baixar Redação
                      </Button>

                      <Button className={classes.button}  variant="outlined" color="primary">
                        Enviar Correção
                      </Button>
                    </Grid>

                  </Grid>
                </AccordionDetails>

              </Accordion>
            )
          }) : null
        }
      </>
    )
  }

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
              <div id="propostaRedacao" className='ck-content' dangerouslySetInnerHTML={{ __html: propostaRedacao}} />
            </MyCard>
          </Grid>

          <Grid item={true} xs={12} sm={6} align='center'>
            {ListarPorAluno()}
          </Grid>
          
        </Grid>
      </section>
    </MyContainer>
  );
};
